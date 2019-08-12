const clean = require("./clean");
const transform = require("./transform");
const copy = require("./copy");
const late = require("./late");
const glob = require("@vimlet/commons-glob");
const path = require("path");

// @property sortIndexModifier (private) [Added to sort index integer to have free index below when using before/after]
const sortIndexModifier = 1000;

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
  await processSorted(config, sorted.sorted);
  await build(config, sorted.unsorted);
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
      if (Array.isArray(output.input)) {
        var newInput = {};
        output.input.forEach(inp => {
          newInput[inp] = true;
          output.input = newInput;
        });
        return output;
      } else {
        var newInput = {};
        newInput[output.input] = true;
        output.input = newInput;
        return output;
      }
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
    if (Array.isArray(output)) {
      var res = output.map(element => {
        if (typeof element === 'string') {
          var current = {
            input: {}
          };
          current.input[element] = true;
          return current;
        } else {
          if (typeof element.input === 'object' && !Array.isArray(element.input)) {
            return element;
          } else if (Array.isArray(element.input)) {
            var input = {};
            element.input.forEach(eInput => {
              input[eInput] = true;
            });
            element.input = input;
            return element;
          } else {
            var input = {};
            input[element.input] = true;
            element.input = input;
            return element;
          }
        }
      });
      return res;
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
      config.output[element].outPath = element;
      if ("order" in config.output[element]) {
        var currentOrder = parseInt(config.output[element].order) + sortIndexModifier;
        config.output[element].outPath = element;
        if (!sorted[currentOrder]) {
          sorted[currentOrder] = [];
        }
        sorted[currentOrder].push(config.output[element]);
      } else {
        unsorted.push(config.output[element]);
      }
    } else if (Array.isArray(config.output[element])) {
      config.output[element].forEach(e => {
        e.outPath = element;
        if ("order" in e) {
          var currentOrder = parseInt(e.order) + sortIndexModifier;
          if (!sorted[currentOrder]) {
            sorted[currentOrder] = [];
          }
          sorted[currentOrder].push(e);
        } else {
          unsorted.push(e);
        }
      });
    }
  });
  return sortBeforeAfter(config, sorted, unsorted);
}

// @function sortBeforeAfter (private) [Sort unsorted items which have before/after key]
function sortBeforeAfter(config, sorted, unsorted) {
  // Remove before/after items from unsorted
  var before = [];
  var after = [];
  var referredBeforeAfter = [];
  unsorted = unsorted.filter(item => {
    var added = false;
    if (item.before) {
      added = true;
      referredBeforeAfter.push(item.before);
      before.push(item);
    }
    if (item.after) {
      added = true;
      referredBeforeAfter.push(item.after);
      after.push(item);
    }
    if (!added) {
      return item;
    }
  });

  // Add referred items from unsorted to sorted
  unsorted = unsorted.filter(unsortedItem => {
    if (unsortedItem.id && referredBeforeAfter.indexOf(unsortedItem.id) >= 0) {
      sorted.push(unsortedItem);
    } else {
      return unsortedItem;
    }
  });
  
  // Add before items to sorted list
  before.forEach(itemBefore => {
    var added = false;
    for (const key in sorted) {
      var item = sorted[key];
      item.forEach(current => {
        if (current.id && current.id === itemBefore.before) {
          var currentKey = parseInt(key) - 1;
          if (!sorted[currentKey]) {
            sorted[currentKey] = [];
          }
          added = true;
          sorted[currentKey].push(itemBefore);
        }
      });
    }
    if (!added) {
      if (!("log" in config) || config.log) {
        console.log("Item " + itemBefore + "hasn't found its before index");
      }
      unsorted.push(itemBefore);
    }
  });
  // Add after items to sorted list
  after.forEach(itemAfter => {
    var added = false;
    for (const key in sorted) {
      var item = sorted[key];
      item.forEach(current => {
        if (current.id && current.id === itemAfter.after) {
          var currentKey = parseInt(key) + 1;
          if (!sorted[currentKey]) {
            sorted[currentKey] = [];
          }
          added = true;
          sorted[currentKey].push(itemAfter);
        }
      });
    }
    if (!added) {
      if (!("log" in config) || config.log) {
        console.log("Item " + itemAfter + "hasn't found its after index");
      }
      unsorted.push(itemAfter);
    }
  });
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