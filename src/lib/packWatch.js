const glob = require("@vimlet/commons-glob");

// @function addBeforeAfterToMatch (public) [Add items with before or after to match] @param config @param tempBefAft @param key
module.exports.addBeforeAfterToMatch = function (config, tempBefAft, key) {
  beforeAfterById(config, tempBefAft, key);
  beforeAfterByBefore(config, tempBefAft, key);
  beforeAfterByAfter(config, tempBefAft, key);
}

// @function beforeAfterByAfter (private) [Check if given key has after in it and add related] @param config @param tempBefAft @param key
function beforeAfterByAfter(config, tempBefAft, key) {
  if (config.output && config.output[key] && "after" in config.output[key]) {
    var currentAfter = config.output[key].after.split(" ");
    currentAfter.forEach(cA => {
      if (config.task && config.task[cA]) {
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
}
// @function beforeAfterByBefore (private) [Check if given key has before in it and add related] @param config @param tempBefAft @param key
function beforeAfterByBefore(config, tempBefAft, key) {
  if (config.output && config.output[key] && "before" in config.output[key]) {
    var currentBefore = config.output[key].before.split(" ");
    currentBefore.forEach(cB => {
      if (config.task && config.task[cB]) {
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
}

// @function beforeAfterById (private) [Check if given id is linked to any before or after] @param config @param tempBefAft @param key
function beforeAfterById(config, tempBefAft, key) {
  beforeAfterByIdOutput(config, tempBefAft, key);
  beforeAfterByIdTask(config, tempBefAft, key);
}


// @function beforeAfterById (private) [Check if given id is linked to any before or after at output] @param config @param tempBefAft @param key
function beforeAfterByIdOutput(config, tempBefAft, key) {
  if (config.output && config.output[key] && "id" in config.output[key]) {
    var currentId = config.output[key].id;
    for (var outKey in config.output) {
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
    if (config.task) {
      for (var taskKey in config.task) {
        if ("before" in config.task[taskKey]) {
          var currentBefore = config.task[taskKey].before.split(" ");
          currentBefore.forEach(cB => {
            if (cB === currentId) {
              addToItsPlace(config, tempBefAft, taskKey);
            }
          });
        }
        if ("after" in config.task[taskKey]) {
          var currentAfter = config.task[taskKey].after.split(" ");
          currentAfter.forEach(cA => {
            if (cA === currentId) {
              addToItsPlace(config, tempBefAft, taskKey);
            }
          });
        }
      }
    }
  }
}
// @function beforeAfterById (private) [Check if given id is linked to any before or after at task] @param config @param tempBefAft @param key
function beforeAfterByIdTask(config, tempBefAft, key) {
  if (config.task && config.task[key]) {
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
      tempBefAft.output[key] = true;
      module.exports.addBeforeAfterToMatch(config, tempBefAft, key);
    }
  } else if (config.task && config.task[key]) {
    if (!tempBefAft.task[key]) {
      tempBefAft.task[key] = true;
      module.exports.addBeforeAfterToMatch(config, tempBefAft, key);
    }
  }
}


// @function addOrderedToMatch (public) [Add items with order to match] @param config @param newOutput @param newTask
module.exports.addOrderedToMatch = function (config, newOutput, newTask) {
  var tempOutput = [];
  for (var key in newOutput) {
    if ("order" in newOutput[key]) {
      for (var outKey in config.output) {
        if ("order" in config.output[outKey]) {
          tempOutput.push(outKey);
        }
      }
      if (config.task) {
        for (var taskKey in config.task) {
          if ("order" in config.task[taskKey]) {
            newTask[taskKey] = config.task[taskKey];
          }
        }
      }
    }
  }
  tempOutput.forEach(tOut => {
    newOutput[tOut] = config.output[tOut];
  });
}


// @function matchSingleConfig (public) [Check whether an input match with modified file] @param inputs @param matches @param filePath @param outputKey
module.exports.matchSingleConfig = function (inputs, matches, filePath, outputKey) {
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