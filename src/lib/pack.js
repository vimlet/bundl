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
// @property idOutputsRelation (private) [Map for output keys which have id]
var idOutputsRelation = {};
// @property transformArrays (private) [Add transform object array]
var transformArrays = {};
// @property buildCalls (private) [Number of sorted key plus 1 for unsorted plus 1 for after, plus beforeRelation objects.keys.length which is the number than build is going to be called. When it reaches 0, transformArray should be launched]
var buildCalls;

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
  buildCalls = Object.keys(sorted.sorted).length + 1 + 1 + Object.keys(beforeRelation).length;
  await Promise.all([processSorted(config, sorted.sorted), build(config, sorted.unsorted), build(config, sorted.after)]);
  console.log("Build completed at: " + getTime());
}


// @function processTransformArray (private) [Process transform array promises]
function processTransformArray(config) {
  return new Promise(async (resolve, reject) => {
    for (const key in transformArrays) {
      var transformArray = transformArrays[key];
      transformArray.promises = await Promise.all(transformArray.promises);
      var content = "";
      while (transformArray.position.length > 0) {
        var currentId = transformArray.position.shift();
        transformArray.promises.forEach(cPromise => {
          if (cPromise.id === currentId) {
            content += cPromise.content + ((transformArray.position.length > 0) ? "\n" : "");
          }
        });
      }

      let result = {
        parse: transformArray.promises[0].parse,
        outputParent: transformArray.promises[0].outputParent,
        outputPath: transformArray.promises[0].outputPath,
        content: content
      };
      var hashes = {};      
      await late.process([result], hashes, config);
    }
    resolve();
  });
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

// async function build(config, objs) {  
//   return new Promise(async (resolve, reject) => {
//     let hashes = {};
//     let processOutputPromises = await processCopyTransform(config, objs, hashes);
//     buildCalls--;
//     if (buildCalls === 0) {      
//       await processTransformArray(config);  // TODO fix await
//     }    
//     await Promise.all(processOutputPromises.map(async currentP => {
//       var solved = await currentP;
//       if (Array.isArray(solved)) {
//         await Promise.all(solved.map(async cuSolved => {
//           cuSolved = await cuSolved;
//           await late.process([cuSolved], hashes, config);
//         }));
//       } else {      
//         if ("_waitTransform" in solved) {
//         } else {          
//           await late.process([solved], hashes, config);
//         }
//       }
//     }));
//     resolve();
//   });
// }

// @function build (private) [Build an array of objs] @param config @param objs
async function build(config, objs) {
  return new Promise(async (resolve, reject) => {
    buildCalls--;
    if (buildCalls === 0) {
      await processTransformArray(config); // TODO fix await
    }    
    await Promise.all(objs.map(async obj => {
      await buildObj(config, obj);
    }));
    resolve();
  });
}

// @function buildObj (private) [Build an obj] @param config @param obj
async function buildObj(config, obj) {
  return new Promise(async (resolve, reject) => {
    let hashes = {};    
    let processOutputPromises = await processCopyTransform(config, obj, hashes);
    await Promise.all(processOutputPromises.map(async currentP => {
      var solved = await currentP;
      if (Array.isArray(solved)) {
        await Promise.all(solved.map(async cuSolved => {
          cuSolved = await cuSolved;          
          await late.process([cuSolved], hashes, config);
        }));
      } else {
        if ("_waitTransform" in solved) {          
        } else {          
          await late.process([solved], hashes, config);
        }
      }
    }));
    resolve();
  });
}

// @function processCopyTransform (private) [Process output objects into promises] @param config @param objs @param hashes
async function processCopyTransform(config, obj, hashes) {
  return new Promise(async (resolve, reject) => {
    let processOutputPromises = [];
    if (obj._waitFor) {
      await Promise.all(obj._waitFor.map(async currentWait =>{
        beforeRelation[currentWait] = build(config, [beforeRelation[currentWait]]);
        await beforeRelation[currentWait];
      }));
    }
    if (obj.after) {
      if (!Array.isArray(obj.after)) {
        obj.after = obj.after.split("");
      }
      for (const afterId of obj.after) {
        if (idOutputsRelation[afterId]) {
          await idOutputsRelation[afterId];
        }
      }
    }
    var isCopy = obj.outPath.endsWith("**");
    var currentPromise;
    if (isCopy) {
      currentPromise = copy.process(config, obj);
      processOutputPromises.push(currentPromise);
    } else {
      currentPromise = transform.process(config, obj, hashes);
      processOutputPromises.push(currentPromise);
      if ("_waitTransform" in obj) {
        transformArrays[obj.outPath].promises.push(currentPromise);
      }
    }
    if (obj.id) {
      idOutputsRelation[obj.id] = currentPromise;
    }
    resolve(processOutputPromises);
  });
}

// @function processCopyTransform (private) [Process output objects into promises] @param config @param objs @param hashes
// async function processCopyTransform(config, obj, hashes) {
//   return new Promise(async (resolve, reject) => {
//     let processOutputPromises = [];
//     for (const obj of objs) {
//       if (obj._waitFor) {
//         await beforeRelation[obj._waitFor];
//       }
//       if (obj.after) {
//         if (!Array.isArray(obj.after)) {
//           obj.after = obj.after.split("");
//         }
//         for (const afterId of obj.after) {
//           if (idOutputsRelation[afterId]) {
//             await idOutputsRelation[afterId];
//           }
//         }
//       }
//       var isCopy = obj.outPath.endsWith("**");
//       var currentPromise;
//       if (isCopy) {
//         currentPromise = copy.process(config, obj);
//         processOutputPromises.push(currentPromise);
//       } else {
//         currentPromise = transform.process(config, obj, hashes);
//         processOutputPromises.push(currentPromise);
//         if ("_waitTransform" in obj) {
//           transformArrays[obj.outPath].promises.push(currentPromise);
//         }
//       }
//       if (obj.id) {
//         idOutputsRelation[obj.id] = currentPromise;
//       }
//     }
//     resolve(processOutputPromises);
//   });
// }

// @function setupConfig (private)
function setupConfig(config) {
  config.hashLength = "hashLength" in config ? config.hashLength : 7;
  config.outputBase = "outputBase" in config ? config.outputBase : "";
  config.inputBase = "inputBase" in config ? config.inputBase : "";
  config.clean = "clean" in config ? config.clean : false;
  config = queryParam(config);
  return config;
}

// @function queryParam (private) [Manage query param in outputs]
function queryParam(config) {
  if (typeof config.output != 'object') {
    throw new Error("Bundl.config is bad formatted");
  }
  var output = {};
  for (var key in config.output) {
    var query = key.split("?");
    if (query.length > 1) {
      try {
        output[query[0]] = setOutput(config.output[key], key);
        var param = query[1].split("&");
        param.forEach(element => {
          setParam(element, output[query[0]]);
        });
      } catch (e) {
        console.log("Error parsing query param at: " + key);
      }
    } else {
      output[key] = setOutput(config.output[key], key);
    }
  }
  config.output = output;
  return config;
}

// @function setOutput (private) [Set output config from inputs. Handle array, string or object] @param output [Object] @param key [Output key]
function setOutput(output, key) {
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

// @function setOutputString (private) [Set output config where output is a string] @param output [Object]
function setOutputString(output) {
  var res = {
    input: {}
  };
  res.input[output] = true;
  return res;
}

// @function setOutputArray (private) [Set output config where output is an array] @param output [Object]
function setOutputArray(output) {
  output = output.map(current => {
    if (typeof current === 'object') {
      return setOutputObject(current);
    } else {
      return setOutputString(current);
    }
  });
  return output;
}

// @function setOutputObject (private) [Set output config where output is an object] @param output [Object]
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
  var sorted = {}; // Add sorted
  var unsorted = []; // Add unsorted
  var before = {}; // Add with before key
  var after = []; // Add with after key
  Object.keys(config.output).forEach(element => {
    if (typeof config.output[element] === 'object' && !Array.isArray(config.output[element])) {
      sortOutputObject(config, config.output[element], element, sorted, unsorted, before, after);
    } else if (Array.isArray(config.output[element])) {
      sortOutputArray(config, element, sorted, unsorted, before, after);
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
    for(var key in beforeRelation){
      if ("id" in beforeRelation[key] && beforeRelation[key].id === beforeKey) {
        beforeRelation[key]._waitFor = before[beforeKey];
      }
    }    
  }
  return {
    sorted: sorted,
    unsorted: unsorted,
    before: before,
    after: after
  };
}

// @function sortOutputString (private) [Sort output key where it is an string] @param config @param element [Output key] @param unsorted [Array for unsorted elements]
function sortOutputString(config, element, unsorted) {
  var current = {};
  current.outPath = element;
  current.input = config.output[element];
  unsorted.push(current);
}

// @function sortOutputArray (private) [Sort output key where it is an array] @param config @param element [Output key] @param unsorted [Array for unsorted elements] @param before @param after
function sortOutputArray(config, element, sorted, unsorted, before, after) {
  var isCopy = element.endsWith("**");
  if (isCopy) {
    config.output[element].forEach(currentObject => {
      sortOutputObject(config, currentObject, element, sorted, unsorted, before, after);
    });
  } else {
    var tId = 0;
    config.output[element].forEach(currentObject => {
      if (!currentObject.id) {
        currentObject.id = "_" + tId;
        tId++;
      }
      currentObject._waitTransform = element;
      transformArrays[element] = transformArrays[element] || {
        position: [],
        promises: []
      };
      transformArrays[element].position.push(currentObject.id);
      sortOutputObject(config, currentObject, element, sorted, unsorted, before, after);
    });
  }
}

// @function sortOutputObject (private) [Sort output key where it is an object] @param config @param obj [Output object] @param key [Output key] @param sorted [Object for sorted elements] @param unsorted [Array for unsorted elements] @param before [Array to add items labeled with before key] @param after [Array to add items labeled with after key]
function sortOutputObject(config, obj, key, sorted, unsorted, before, after) {
  if ("order" in obj) {
    var currentOrder = parseInt(obj.order);
    sorted[currentOrder] = sorted[currentOrder] || [];
    obj.outPath = key;
    sorted[currentOrder].push(obj);
  } else {
    if ("before" in obj) {
      sortBefore(config, obj, key, before);
    } else if ("after" in obj) {
      obj.outPath = key;
      after.push(obj);
    } else {
      obj.outPath = key;
      unsorted.push(obj);
    }
  }
}

// @function getBeforeId (private) [Get an id to identify a before promise without id]
function getBeforeId() {
  var current = "__" + currentBeforeId;
  currentBeforeId++;
  return current;
}

// @function sortBefore (private) [Add elements with before key to before array] @param config @param element [Output key] @param before [Array to add items labeled with before key]
function sortBefore(config, obj, key, before) {
  if (!Array.isArray(obj.before)) {
    obj.before = obj.before.split(" ");
  }
  obj.outPath = key;
  obj.id = obj.id || getBeforeId();  
  beforeRelation[obj.id] = obj;
  obj.before.forEach(bElem => {
    before[bElem] = before[bElem] || [];
    before[bElem].push(obj.id);
  });
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