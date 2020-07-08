const glob = require("@vimlet/commons-glob");

// @function addBeforeAfterToMatch (public) [Add items with before or after to match] @param config @param tempBefAft @param key
module.exports.addBeforeAfterToMatch = function (config, tempBefAft, key) {
  beforeAfterById(config, tempBefAft, key);
  beforeAfterByBefore(config, tempBefAft, key);
  beforeAfterByAfter(config, tempBefAft, key);
}

// @function beforeAfterByAfter (private) [Check if given key has after in it and add related] @param config @param tempBefAft @param key
function beforeAfterByAfter(config, tempBefAft, key) {
  if (config.output && config.output[key]) {
    if (Array.isArray(config.output[key])) {
      config.output[key].forEach(cO => {
        if ("after" in cO) {
          addBeforeAfterByAfter(config, tempBefAft, cO.after.split(" "));
        }
      });
    } else {
      if ("after" in config.output[key]) {
        addBeforeAfterByAfter(config, tempBefAft, config.output[key].after.split(" "));
      }
    }
  }
}
// @function addBeforeAfterByAfter (private) [Add items with after to temporal before after config] @param config @param tempBefAft @param currentAfter
function addBeforeAfterByAfter(config, tempBefAft, currentAfter) {
  currentAfter.forEach(cA => {
    if (config.tasks && config.tasks[cA]) {
      addToItsPlace(config, tempBefAft, cA);
    } else if (config.output) {
      for (var outKey in config.output) {
        if ("id" in config.output[outKey] && config.output[outKey].id === cA) {
          addToItsPlace(config, tempBefAft, outKey);
        }
      }
    }
  });

}

// @function beforeAfterByBefore (private) [Check if given key has before in it and add related] @param config @param tempBefAft @param key
function beforeAfterByBefore(config, tempBefAft, key) {
  if (config.output && config.output[key]) {
    if (Array.isArray(config.output[key])) {
      config.output[key].forEach(cO => {
        if ("before" in cO) {
          addBeforeAfterByBefore(config, tempBefAft, cO.before.split(" "));
        }
      });
    } else {
      if ("before" in config.output[key]) {
        addBeforeAfterByBefore(config, tempBefAft, config.output[key].before.split(" "));
      }
    }
  }
}

// @function addBeforeAfterByBefore (private) [Add items with before to temporal before after config] @param config @param tempBefAft @param currentBefore
function addBeforeAfterByBefore(config, tempBefAft, currentBefore) {
  currentBefore.forEach(cB => {
    if (config.tasks && config.tasks[cB]) {
      addToItsPlace(config, tempBefAft, cB);
    } else if (config.output) {
      for (var outKey in config.output) {
        if ("id" in config.output[outKey] && config.output[outKey].id === cB) {
          addToItsPlace(config, tempBefAft, outKey);
        }
      }
    }
  });
}

// @function beforeAfterById (private) [Check if given id is linked to any before or after] @param config @param tempBefAft @param key
function beforeAfterById(config, tempBefAft, key) {
  beforeAfterByIdOutput(config, tempBefAft, key);
  beforeAfterByIdTask(config, tempBefAft, key);
}


// @function beforeAfterById (private) [Check if given id is linked to any before or after at output] @param config @param tempBefAft @param key
function beforeAfterByIdOutput(config, tempBefAft, key) {
  if (config.output && config.output[key]) {
    if (Array.isArray(config.output[key])) {
      config.output[key].forEach(cO => {
        if ("id" in cO) {
          addBeforeAfterByIdOutput(config, tempBefAft, cO.id);
        }
      });
    } else {
      if ("id" in config.output[key]) {
        addBeforeAfterByIdOutput(config, tempBefAft, config.output[key].id);
      }
    }
  }
}
// @function addBeforeAfterByIdOutput (private) [Add given id to temporal before after] @param config @param tempBefAft @param currentId
function addBeforeAfterByIdOutput(config, tempBefAft, currentId) {
  for (var outKey in config.output) {
    if (Array.isArray(config.output[outKey])) {
      config.output[outKey].forEach(cO => {
        if ("before" in cO) {
          var currentBefore = cO.before.split(" ");
          currentBefore.forEach(cB => {
            if (cB === currentId) {
              addToItsPlace(config, tempBefAft, outKey);
            }
          });
        }
        if ("after" in cO) {
          var currentAfter = cO.after.split(" ");
          currentAfter.forEach(cA => {
            if (cA === currentId) {
              addToItsPlace(config, tempBefAft, outKey);
            }
          });
        }
      });
    } else {
      if ("before" in config.output[outKey]) {
        var currentBefore = config.output[outKey].before.split(" ");
        currentBefore.forEach(cB => {
          if (cB === currentId) {
            addToItsPlace(config, tempBefAft, outKey);
          }
        });
      }
      if ("after" in config.output[outKey]) {
        var currentAfter = config.output[outKey].after.split(" ");
        currentAfter.forEach(cA => {
          if (cA === currentId) {
            addToItsPlace(config, tempBefAft, outKey);
          }
        });
      }
    }
  }
  if (config.tasks) {
    for (var taskKey in config.tasks) {
      if ("before" in config.tasks[taskKey]) {
        var currentBefore = config.tasks[taskKey].before.split(" ");
        currentBefore.forEach(cB => {
          if (cB === currentId) {
            addToItsPlace(config, tempBefAft, taskKey);
          }
        });
      }
      if ("after" in config.tasks[taskKey]) {
        var currentAfter = config.tasks[taskKey].after.split(" ");
        currentAfter.forEach(cA => {
          if (cA === currentId) {
            addToItsPlace(config, tempBefAft, taskKey);
          }
        });
      }
    }
  }
}


// @function beforeAfterById (private) [Check if given id is linked to any before or after at task] @param config @param tempBefAft @param key
function beforeAfterByIdTask(config, tempBefAft, key) {
  if (config.tasks && config.tasks[key]) {
    for (var outKey in config.output) {
      if ("before" in config.output[outKey]) {
        var currentBefore = config.output[outKey].before.split(" ");
        currentBefore.forEach(cB => {
          if (cB === key) {
            addToItsPlace(config, tempBefAft, outKey);
          }
        });
      }
      if ("after" in config.output[outKey]) {
        var currentAfter = config.output[outKey].after.split(" ");
        currentAfter.forEach(cA => {
          if (cA === key) {
            addToItsPlace(config, tempBefAft, outKey);
          }
        });
      }
    }
  }
}

// @function addToItsPlace (private) [Add given key to where it belongs: output or task] @param config @param tempBefAft, @param key
function addToItsPlace(config, tempBefAft, key) {
  if (config.output && config.output[key]) {
    if (!tempBefAft.output[key]) {
      tempBefAft.output[key] = config.output[key];
      module.exports.addBeforeAfterToMatch(config, tempBefAft, key);
    }
  } else if (config.tasks && config.tasks[key]) {
    if (!tempBefAft.task[key]) {
      tempBefAft.task[key] = true;
      module.exports.addBeforeAfterToMatch(config, tempBefAft, key);
    }
  }
}


// @function addOrderedTaskToMatch (public) [Add items with order to match] @param config @param newTask
module.exports.addOrderedTaskToMatch = function (config, newTask) {  
    if (config.tasks) {
      for (var taskKey in config.tasks) {
        if ("order" in config.tasks[taskKey]) {
          newTask[taskKey] = config.tasks[taskKey];
        }
      }
    }
}

// The following method is used to add only those tasks which are affected by any ordered input
// // @function addOrderedTaskToMatch (public) [Add items with order to match] @param config @param newOutput @param newTask
// module.exports.addOrderedTaskToMatch = function (config, newOutput, newTask) {
//   for (var key in newOutput) {
//     if (Array.isArray(newOutput[key])) {
//       newOutput[key].forEach(nO => {
//         if ("order" in nO) {
//           addOrderedTaskToMatch(config, newOutput, newTask);
//         }
//       });
//     } else {
//       if ("order" in newOutput[key]) {
//         addOrderedTaskToMatch(config, newOutput, newTask);
//       }
//     }
//   }
// }

// // @function addOrderedTaskToMatch (private) [Add ordered to match if key has order] @param config @param newOutput @param newTask
// function addOrderedTaskToMatch(config, newOutput, newTask) {
//   for (var outKey in config.output) {
//     if (Array.isArray(config.output[outKey])) {
//       config.output[outKey].forEach(cO => {
//         if ("order" in cO) {
//           newOutput[outKey] = newOutput[outKey] || [];
//           newOutput[outKey].push(cO);
//         }
//       });
//     } else {
//       if ("order" in config.output[outKey]) {
//         newOutput[outKey] = config.output[outKey];
//       }
//     }
//   }
//   if (config.tasks) {
//     for (var taskKey in config.tasks) {
//       if ("order" in config.tasks[taskKey]) {
//         newTask[taskKey] = config.tasks[taskKey];
//       }
//     }
//   }
// }

// @function addTasksWatch (private) @param config @param filePath @param newTask
module.exports.addTasksWatch = function(config, filePath, newTask){
  if (config.tasks) {
    for (var taskKey in config.tasks) {
      if ("watch" in config.tasks[taskKey]) {
        var watch = config.tasks[taskKey].watch;
        if(!Array.isArray(watch)){
          watch = [watch];
        }
        watch.forEach(element=>{
          if (glob.match(filePath, element).length > 0) {            
            newTask[taskKey] = config.tasks[taskKey];
            newTask[taskKey]._force = true;
          }
        });
      }
    }
  }
};
// @function addTasksRunOnBuild (private) [Add tasks which has the option runOnBuild] @param config @param filePath @param newTask
module.exports.addTasksRunOnBuild = function(config, filePath, newTask){
  if (config.tasks) {
    for (var taskKey in config.tasks) {
      if ("runOnBuild" in config.tasks[taskKey] && config.tasks[taskKey].runOnBuild) {
        newTask[taskKey] = config.tasks[taskKey];
        newTask[taskKey]._force = true;
      }
    }
  }
};


// @function matchSingleConfig (public) [Check whether an input match with modified file] @param inputs @param matches @param filePath @param outputKey
module.exports.matchSingleConfig = function (inputs, matches, filePath, outputKey) {
  for (var inputKey in inputs) {    
    if (typeof inputs[inputKey] === "object" &&
      !Array.isArray(inputs[inputKey]) && "watch" in inputs[inputKey]) {
      if (glob.match(filePath, inputs[inputKey].watch).length > 0) {
        matches[outputKey] = inputKey;
      }
    } else if (glob.match(filePath, inputKey).length > 0) {
      matches[outputKey] = matches[outputKey] || [];
      matches[outputKey].push(inputKey);
    }
  }
}