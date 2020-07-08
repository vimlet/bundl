const clean = require("./clean");
const transform = require("./transform");
const copy = require("./copy");
const task = require("./task");
const late = require("./late");
const util = require("./util");
const path = require("path");
const configurator = require("./configurator");
const sorter = require("./sorter");
const packWatch = require("./packWatch");

// @function build (public) [Launch build process]
module.exports.build = async config => {
  if (!("log" in config) || config.log) {
    console.log("Build started at: " + util.getTime());
  }
  config = configurator.setupOutput(config);
  await clean(config);
  await pack(config);
};

// @function runTask (public) [Run given task]
module.exports.runTask = async (config, tasks) => {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(tasks)) {
      tasks = tasks.split(" ");
    }
    config = configurator.setupOutput(config);
    let sorted = sorter.process(config);
    await Promise.all(tasks.map(async currentTask => {
      try {
        await process(config, sorted, currentTask);
      } catch (e) {
        console.log("Error", e);
      }
    }));
    resolve();
  });
};

// @function pack (private) [After clean, sort and start packing]
async function pack(config) {
  return new Promise(async (resolve, reject) => {
    let sorted = sorter.process(config);
    await Promise.all([buildSorted(config, sorted), build(config, sorted, sorted.list.unsorted), buildAfter(config, sorted)]);
    console.log("Build completed at: " + util.getTime());
    resolve();
  });
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
// @function buildAfter (private) [Build after elements] @param config @param sorted
async function buildAfter(config, sorted) {
  return new Promise(async (resolve, reject) => {
    var afterArray = [];
    // Add after elements
    for (var key in sorted.list.after) {
      afterArray.push(key);
    }
    // Remove those which have to be waited for so they won't be launched several times as elements which should be waited will be launched on its own
    for (var key in sorted.list.after) {
      sorted.list.after[key].forEach(waitFor => {
        var index = afterArray.indexOf(waitFor);
        if (index > -1) {
          afterArray.splice(index, 1);
        }
      });
    }
    await build(config, sorted, afterArray)
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
    var obj = sorted.data[key].obj;
    try {
      switch (obj._type) {
        case "task":
          await process(config, sorted, key);
          sorted.data[key].status = "solved";
          break;
        case "copy":
          var current = await process(config, sorted, key);
          if (current) {
            await Promise.all(current.map(async cCopy => {
              cCopy = await cCopy;
              await lateAndWrite(cCopy, config, sorted, key);
            }));
          }
          sorted.data[key].status = "solved";
          break;
        case "transform":
          var current = await process(config, sorted, key);
          if (current) {
            sorted.data[key].status = "solved";
            await lateAndWrite(current, config, sorted, key);
          }
          break;
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// @function lateAndWrite (private) [Launch late operations and write result to disk] @param obj @param config @param sorted @param key
async function lateAndWrite(obj, config, sorted, key) {
  return new Promise(async (resolve, reject) => {
    if (sorted.list.transformArray[sorted.data[key].obj.outPath]) {
      await lateTransformArray(config, sorted, sorted.list.transformArray[sorted.data[key].obj.outPath]);
    } else {
      await late.process([obj], sorted.meta, config);
    }
    resolve();
  });
}

// @function lateTransformArray (private) [Launch late operations and write result to disk for transforms arrays] @param config @param sorted @param transformArray
async function lateTransformArray(config, sorted, transformArray) {
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
      await late.process([obj], sorted.meta, config);
    }
    resolve();
  });
}

// @function process (private) [Launch promises] @param config @param sorted @param key
async function process(config, sorted, key) {
  return new Promise(async (resolve, reject) => {
    if (sorted.data[key]) {
      if (sorted.data[key].status === "object") {
        if ("_waitFor" in sorted.data[key]) {
          await waitForOthers(config, sorted, key);
        }
        var obj = sorted.data[key].obj;
        var currentPromise;
        switch (obj._type) {
          case "task":
            await task.process(config, obj);
            break;
          case "copy":
            currentPromise = copy.process(config, obj, sorted.meta);
            break;
          case "transform":
            currentPromise = transform.process(config, obj, sorted.meta);
            break;
        }
        sorted.data[key].status = "triggered";
        sorted.data[key].promise = currentPromise;
        resolve(currentPromise);
      } else {
        resolve();
      }
    } else {
      reject("Not found " + key);
    }
  });
}

// @function waitForOthers (private) [Wait for other promises to be resolved before continue] @param config @param sorted @param key
async function waitForOthers(config, sorted, key) {
  return new Promise(async (resolve, reject) => {
    await Promise.all(sorted.data[key]._waitFor.map(async waitFor => {


      if (sorted.data[waitFor] && sorted.data[waitFor].status === "object") {
        // if (sorted.data[waitFor].status === "object") {

        await buildObj(config, sorted, waitFor);


      } else if (sorted.data[waitFor] && sorted.data[waitFor].status === "triggered") {
        // } else if (sorted.data[waitFor].status === "triggered") {


        await sorted.data[waitFor].promise;
      }
    }));
    resolve();
  });
}

// @function buildSingle (public) [Build single file which has been modified. Used at watch mode] @param config @param filePath @param event [Watcher trigger event]
module.exports.buildSingle = async function (config, filePath, event) {
  return new Promise(async (resolve, reject) => {
    if (!("log" in config) || config.log) {
      console.log("File modified: " + filePath);
    }
    config = configurator.setupOutput(config);
    config._isWatch = true;
    filePath = path.relative(config.inputBase, filePath).replace(/\\/g, "/");
    var matches = {};
    for (var outputKey in config.output) {
      if (!Array.isArray(config.output[outputKey])) {
        var inputs = config.output[outputKey].input;
        packWatch.matchSingleConfig(inputs, matches, filePath, outputKey);
      } else {
        config.output[outputKey].forEach(function (cOut) {
          var inputs = cOut.input;          
          packWatch.matchSingleConfig(inputs, matches, filePath, outputKey);
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
      for (var mat in matches) {
        if (mat.indexOf("{{hash}}") >= 0) {
          hashes.push(mat);
        }
      }
      await clean(config, {
        filePath: filePath,
        matches: hashes
      });
    }
    var newOutput = {};
    for (var match in matches) {
      if (config.output[match]) {
        if (!Array.isArray(config.output[match])) {
          newOutput[match] = config.output[match];
        } else {
          newOutput[match] = [];
          config.output[match].forEach(function (cOut) {
            for (var inputkey in cOut.input) {
              matches[match].forEach(matchInput => {
                if (matchInput == inputkey) {
                  newOutput[match].push(cOut);
                }
              });
            }
          });
        }
      }
    }
    var newTask = {};
    packWatch.addOrderedTaskToMatch(config, newTask);
    // packWatch.addOrderedTaskToMatch(config, newOutput, newTask); // Used to add only those tasks affected by the file changed
    packWatch.addTasksWatch(config, filePath, newTask);    
    packWatch.addTasksRunOnBuild(config, filePath, newTask);    
    // Add before after items
    var tempBefAft = {
      output: {},
      task: {}
    };
    // Add already registered keys
    for (var newOutKey in newOutput) {
      tempBefAft.output[newOutKey] = newOutput[newOutKey];
    }
    for (var newTaskKey in newTask) {
      tempBefAft.task[newTaskKey] = newTask[newTaskKey];
    }
    for (var key in tempBefAft.output) {
      packWatch.addBeforeAfterToMatch(config, tempBefAft, key);
    }
    for (var key in tempBefAft.task) {
      packWatch.addBeforeAfterToMatch(config, tempBefAft, key);
    }
    for (var outKey in tempBefAft.output) {
      newOutput[outKey] = tempBefAft.output[outKey];
    }
    for (var taskKey in tempBefAft.task) {
      newTask[taskKey] = config.tasks[taskKey];
    }
    config.tasks = newTask;
    config.output = newOutput;    
    await pack(config);
    resolve();
  });
};