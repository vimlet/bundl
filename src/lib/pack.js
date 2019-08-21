const clean = require("./clean");
const transform = require("./transform");
const copy = require("./copy");
const late = require("./late");
const glob = require("@vimlet/commons-glob");
const path = require("path");
const configurator = require("./configurator");
const sorter = require("./sorter");

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
  config = configurator.setupOutput(config);
  await clean(config);
  await pack(config);
};

// @function pack (private) [After clean, sort and start packing]
async function pack(config) {
  // let sorted = sort(config);
  let sorted = sorter.sortOutput(config);
  await Promise.all([buildSorted(config, sorted), build(config, sorted, sorted.list.unsorted)]);
  console.log("Build completed at: " + getTime());
}

// @function buildSorted (private) [Build sorted elements] @param config @param sorted
async function buildSorted(config, sorted) {
  return new Promise(async (resolve, reject) => {
    for (var key in sorted.list.sorted) {
      await build(config, sorted, sorted.list.sorted[key]);
    }
    resolve();
  });
}

// @function build (private) [Build an array of objs] @param config @param sorted @param objs
async function build(config, sorted, objs) {
  return new Promise(async (resolve, reject) => {
    await Promise.all(objs.map(async key => {
      await buildObj(config, sorted, key);
    }));
    resolve();
  });
}

// @function buildObj (private) [Build an obj] @param config @param sorted @param key
async function buildObj(config, sorted, key) {
  return new Promise(async (resolve, reject) => {
    let hashes = {};
    var obj = sorted.data[key].obj;
    var isCopy = obj.outPath.endsWith("**");
    if(isCopy){
      var current = await process(config, sorted, key, hashes);
      await Promise.all(current.map(async cCopy =>{
        cCopy = await cCopy;
        await lateAndWrite(cCopy, hashes, config, sorted, key);
      }));
      sorted.data[key].status = "solved";
    }else{
      var current = await process(config, sorted, key, hashes);
      sorted.data[key].status = "solved";
      await lateAndWrite(current, hashes, config, sorted, key);
    }
    resolve();
  });
}

// @function lateAndWrite (private) [Launch late operations and write result to disk]
async function lateAndWrite(obj, hashes, config, sorted, key) {
  return new Promise(async (resolve, reject) => {
    if (sorted.list.transformArray[sorted.data[key].obj.outPath]) {      
      await lateTransformArray(hashes, config, sorted, sorted.list.transformArray[sorted.data[key].obj.outPath]);
    } else {
      await late.process([obj], hashes, config);
    }
    resolve();
  });
}

// @function lateTransformArray (private) [Launch late operations and write result to disk for transforms arrays]
async function lateTransformArray(hashes, config, sorted, transformArray) {  
  return new Promise(async (resolve, reject) => {
    var allDone = true;
    transformArray.forEach(currentTA => {      
      if (sorted.data[currentTA].status != "solved") {        
        allDone = false;
      }
    });
    if (allDone) {      
      var obj;
      content = await transformArray.reduce(async (total, current, index, array) => {
        var solved = await sorted.data[current].promise;
        obj = solved;
        return await total + solved.content + (index < (array.length - 1) ? "\n" : "");
      }, "");
      obj.content = content;      
      await late.process([obj], hashes, config);
    }
    resolve();
  });
}

// @function process (private) [Launch promises] @param config @param sorted @param key @param hashes
async function process(config, sorted, key, hashes) {
  return new Promise(async (resolve, reject) => {
    var obj = sorted.data[key].obj;
    var isCopy = obj.outPath.endsWith("**");
    var currentPromise;
    if (isCopy) {
      currentPromise = copy.process(config, obj);
    } else {
      currentPromise = transform.process(config, obj, hashes);
    }
    sorted.data[key].status = "triggered";
    sorted.data[key].promise = currentPromise;
    resolve(currentPromise);
  });
}

// @function buildSingle (public) [Build single file which has been modified. Used at watch mode] @param config @param filePath @param event [Watcher trigger event]
module.exports.buildSingle = async function (config, filePath, event) {
  config = configurator.setupOutput(config);
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