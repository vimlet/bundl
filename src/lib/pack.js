const clean = require("./clean");
const transform = require("./transform");
const copy = require("./copy");
const late = require("./late");
const glob = require("@vimlet/commons-glob");
const path = require("path");

// @property currentBeforeId (private) [Index to give ids to before promises]
var currentBeforeId = 0;
// @property beforeRelation (private) [Map for before promises and their ids]
var beforeRelation = {};


module.exports.build = async config => {
  if (!("log" in config) || config.log) {
    console.log("Build started...");
  }
  config = setupConfig(config);
  await clean(config);
  await pack(config);
};

// @function pack (private) [After clean, sort and start packing]
async function pack(config) {
  let sorted = sort(config);
  await Promise.all([processSorted(config, sorted.sorted), build(config, sorted.unsorted)]);
  console.log("Build completed at: " + getTime());
}

// @function buildSingle (public) [Build single file which has been modified. Used at watch mode] @param config @param filePath @param event [Watcher trigger event]
module.exports.buildSingle = async function (config, filePath, event) {
  config = setupConfig(config);
  config._isWatch = true;
  filePath = path.relative(config.inputBase, filePath).replace(/\\/g, "/");
  var matches = [];
  for (var outputKey in config.output) {
    if (!Array.isArray(config.output[outputKey])) {
      var inputs = config.output[outputKey].input;
      matchSingleConfig(inputs, matches, filePath, outputKey);
    } else {
      config.output[outputKey].forEach(function (cOut) {
        var inputs = cOut.input;
        matchSingleConfig(inputs, matches, filePath, outputKey);
      });
    }
  }
  if (event && event === "unlink") {
    await clean(config, {
      filePath: filePath,
      matches: matches
    });
  } else {
    // If not unlink, check if it is a hash because modifications should delete old hashes
    var hashes = [];
    matches.forEach(mat => {
      if (mat.indexOf("{{hash}}") >= 0) {
        hashes.push(mat);
      }
    });
    await clean(config, {
      filePath: filePath,
      matches: hashes
    });
  }
  var newOutput = {};
  matches.forEach(match => {
    if (config.output[match]) {
      newOutput[match] = config.output[match];
    }
  });
  config.output = newOutput;
  await pack(config);
};

// @function matchSingleConfig (private) [Check whether an input match with modified file] @param inputs @param matches @param filePath @param outputKey
function matchSingleConfig(inputs, matches, filePath, outputKey) {
  for (var inputKey in inputs) {
    if (typeof inputs[inputKey] === "object" &&
      !Array.isArray(inputs[inputKey]) && "watch" in inputs[inputKey]) {
      if (glob.match(filePath, inputs[inputKey].watch).length > 0) {
        matches.push(outputKey);
      }
    } else if (glob.match(filePath, inputKey).length > 0) {
      matches.push(outputKey);
    }
  }
}

// @function processSorted (private) [Build sorted elements] @param config @param sorted
async function processSorted(config, sorted) {
  return new Promise(async (resolve, reject) => {
    for (var key in sorted) {
      await build(config, sorted[key]);
    }
    resolve();
  });
}

async function build(config, objs) {  
  return new Promise(async (resolve, reject) => {
    let hashes = {};
    let processOutputPromises = [];
    // Process copy and transform actions in order.
    for(const obj of objs){
      if(obj._waitFor){        
        await beforeRelation[obj._waitFor];
      }
      
      var isCopy = obj.outPath.endsWith("**");
      if (isCopy) {
        processOutputPromises.push(copy.process(config, obj));
      } else {
        processOutputPromises.push(transform.process(config, obj, hashes));
      }
    }

    // Flatten results nested arrays
    let processOutputResults = (await Promise.all(processOutputPromises))
      .reduce((prev, current) => {
        if (Array.isArray(current)) {
          current.map(result => {
            prev.push(result);
          });
        } else {
          prev.push(current);
        }
        return prev;
      }, []);
    // Finally process late actions (hash-parse and write)
    await late.process(processOutputResults, hashes, config);
    resolve();
  });
}

// @function setupConfig (private)
function setupConfig(config) {
  config.hashLength = "hashLength" in config ? config.hashLength : 7;
  config.outputBase = "outputBase" in config ? config.outputBase : "";
  config.inputBase = "inputBase" in config ? config.inputBase : "";
  config.clean = "clean" in config ? config.clean : false;
  config = queryParam(config);
  return config;
}

// @function querParam (private) [Manage query param in outputs]
function queryParam(config) {
  if (typeof config.output != 'object') {
    throw new Error("Bundl.config is bad formatted");
  }
  var output = {};
  for (var key in config.output) {
    var query = key.split("?");
    if (query.length > 1) {
      try {
        output[query[0]] = setOutput(config.output[key]);
        var param = query[1].split("&");
        param.forEach(element => {
          setParam(element, output[query[0]]);
        });
      } catch (e) {
        console.log("Error parsing query param at: " + key);
      }
    } else {
      output[key] = setOutput(config.output[key]);
    }
  }
  config.output = output;
  return config;
}

// @function setOutput (private) [Set output config from inputs. Handle array, string or object]
function setOutput(output) {
  if (typeof output === 'object' && !Array.isArray(output)) {
    return setOutputObject(output);
  } else {
    if (Array.isArray(output)) {
      return setOutputArray(output);
    } else {
      return setOutputString(output);
    }
  }
}

// @function setOutputString (private) [Set output config where output is a string]
function setOutputString(output) {
  var res = {
    input: {}
  };
  res.input[output] = true;
  return res;
}

// @function setOutputArray (private) [Set output config where output is an array]
function setOutputArray(output) {
  var res = {
    input: {}
  };
  output.forEach(cuOut => {
    res.input[cuOut] = true;
  });
  return res;
}

// @function setOutputObject (private) [Set output config where output is an object]
function setOutputObject(output) {
  if (typeof output.input === 'object' && !Array.isArray(output.input)) {
    return setInputObject(output);
  } else {
    if (Array.isArray(output.input)) {
      return setInputArray(output);
    } else {
      return setInputString(output);
    }
  }
}

// @function setInputObject (private) [Set input where input is an object]
function setInputObject(output) {
  return output;
}
// @function setInputArray (private) [Set input where input is an array]
function setInputArray(output) {
  var inp = {};
  output.input.forEach(cuInp => {
    if (typeof cuInp != 'object') {
      inp[cuInp] = true;
    } else {
      for (var cuKey in cuInp) {
        inp[cuKey] = cuInp[cuKey];
      }
    }
  });
  output.input = inp;
  return output;
}
// @function setInputString (private) [Set input where input is a string]
function setInputString(output) {
  var inp = {};
  inp[output.input] = true;
  output.input = inp;
  return output;
}



// @function setParam (private) [Set up query params into element config] @param param @param obj [Output object]
function setParam(param, obj) {
  var split = param.split("=");
  if (split[0] && split[1]) {
    switch (split[0]) {
      case "clean":
        var value = split[1] === "true" ? true : false;
        setParamKey(obj, split[0], value);
        break;
      case "parse":
        var value = split[1] === "true" ? true : false;
        setParamKey(obj, split[0], value);
        break;
      default:
        setParamKey(obj, split[0], split[1]);
        break;
    }
  }
}

// @function setParamKey (private) [Set up single param into element config] @param obj [Output object] @param key [Param key] @param value
function setParamKey(obj, key, value) {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    if (!(key in obj)) {
      obj[key] = value;
    }
  } else if (Array.isArray(obj)) {
    obj = obj.map(element => {
      if (typeof element === 'object') {
        if (!(key in element)) {
          element[key] = value;
        }
      }
      return element;
    });
  }
}


// @function sort (private) [Sort config output elements if order is set] @param config
function sort(config) {
  var sorted = {};
  var unsorted = [];
  var before = {};
  Object.keys(config.output).forEach(element => {
    if (typeof config.output[element] === 'object' && !Array.isArray(config.output[element])) {
      sortOutputObject(config, element, sorted, unsorted, before);
    } else if (Array.isArray(config.output[element])) {
      sortOutputArray(config, element, unsorted);
    } else {
      sortOutputString(config, element, unsorted);
    }
  });
  for (var beforeKey in before) {
    unsorted = unsorted.map(current => {
      if ("id" in current && current.id === beforeKey) {
        current._waitFor = before[beforeKey];
      }
      return current;
    });
  }
  return {
    sorted: sorted,
    unsorted: unsorted,
    before: before
  };
}

// @function sortOutputString (private) [Sort output key where it is an string] @param config @param element [Output key] @param unsorted [Array for unsorted elements]
function sortOutputString(config, element, unsorted) {
  var current = {};
  current.outPath = element;
  current.input = config.output[element];
  unsorted.push(current);
}

// @function sortOutputArray (private) [Sort output key where it is an array] @param config @param element [Output key] @param unsorted [Array for unsorted elements]
function sortOutputArray(config, element, unsorted) {
  var current = {};
  current.outPath = element;
  current.input = config.output[element];
  unsorted.push(current);
}

// @function sortOutputObject (private) [Sort output key where it is an object] @param config @param element [Output key] @param sorted [Object for sorted elements] @param unsorted [Array for unsorted elements] @param before [Array to add items labeled with before key]
function sortOutputObject(config, element, sorted, unsorted, before) {
  if ("order" in config.output[element]) {
    var currentOrder = parseInt(config.output[element].order);
    sorted[currentOrder] = sorted[currentOrder] || [];
    config.output[element].outPath = element;
    sorted[currentOrder].push(config.output[element]);
  } else {
    if ("before" in config.output[element]) {
      sortBefore(config, element, before);
    } else {
      config.output[element].outPath = element;
      unsorted.push(config.output[element]);
    }
  }
}

// @function getBeforeId (private) [Get an id to identify a before promise without id]
function getBeforeId(){
  var current = "__" + currentBeforeId;
  currentBeforeId++;
  return current;
}

// @function sortBefore (private) [Add elements with before key to before array] @param config @param element [Output key] @param before [Array to add items labeled with before key]
function sortBefore(config, element, before) {
  if (!Array.isArray(config.output[element].before)) {
    config.output[element].before = config.output[element].before.split(" ");
  }
  if (Array.isArray(config.output[element].before)) {
    config.output[element].outPath = element;
    config.output[element].id = config.output[element].id || getBeforeId();
    beforeRelation[config.output[element].id] = build(config, [config.output[element]]);
    config.output[element].before.forEach(bElem => {
      before[bElem] = before[bElem] || [];
      before[bElem].push(config.output[element].id);
    });
  } else {
    config.output[element].outPath = element;
    config.output[element].id = config.output[element].id || getBeforeId();
    beforeRelation[config.output[element].id] = build(config, [config.output[element]]);
    before[config.output[element].before] = before[config.output[element].before] || [];
    before[bElem].push(config.output[element].id);
  }
}

// @function getTime (private) [Return current time]
function getTime() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  var minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var seconds = today.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  today = dd + '/' + mm + '/' + yyyy + "/" + hours + ":" + minutes + ":" + seconds;
  return today;
};