const bundl = require("../index.js");
const pack = require("./pack");

// @function processUse (private) [Process use function] @param taskObject
async function processUse(taskObject, meta) {
  return new Promise(async (resolve, reject) => {
    var result;

    if (meta) {
      bundl.getHash = function (id) {
        console.log("meta",meta);
        if (meta && meta[id] && meta[id].hash) {
          return meta[id].hash;
        }
        return null;
      }
    }
    
    if ("use" in taskObject) {
      if (Array.isArray(taskObject.use)) {
        for (var i = 0; i < taskObject.use.length; i++) {
          result = await taskObject.use[i](result, bundl);
        }
      } else {
        result = await taskObject.use(result, bundl);
      }
    }
    resolve();
  });
};

// @function processRun (private) [Process runs and runp] @param config @param taskObject
async function processRun(config, taskObject) {
  if ("runs" in taskObject && "runp" in taskObject) {
    await Promise.all([processRunP(config, taskObject), processRunS(config, taskObject)]);    
  } else if ("runp" in taskObject) {
    await processRunP(config, taskObject);
  } else if ("runs" in taskObject) {
    await processRunS(config, taskObject);
  }
}

// @function processRunP (private) [Process secuencial tasks] @param config @param taskObject
async function processRunP(config, taskObject) {
  return new Promise(async (resolve, reject) => {
    var tasksP = taskObject.runp.split(" ");
    await Promise.all(tasksP.map(async taskp => {
      await pack.runTask(config, taskp);
    }));
    resolve();
  });
}

// @function processRunS (private) [Process secuencial tasks] @param config @param taskObject
async function processRunS(config, taskObject) {
  return new Promise(async (resolve, reject) => {
    var tasksS = taskObject.runs.split(" ");
    for (tasks of tasksS) {
      await pack.runTask(config, tasks);
    }
    resolve();
  });
}

// @function process (public) [Process given task object] @param config @param taskObject
module.exports.process = async (config, taskObject, meta) => {  
  if (!("log" in config) || config.log) {
    console.log("Tasks: " + taskObject.id);
  }
  content = await processUse(taskObject, meta);
  await processRun(config, taskObject);
};