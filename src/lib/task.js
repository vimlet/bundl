const bundl = require("../index.js");

// @function processUse (private) [Process use function]
async function processUse(taskObject) {
  return new Promise(async (resolve,reject)=>{
    var result;
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

// @function process (public) [Process given task object]
module.exports.process = async (config, taskObject) => {
  content = await processUse(taskObject);
};