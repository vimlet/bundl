const {
  promisify
} = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);
const path = require("path");

module.exports = {
  inputBase: "tests/resources/taskCompleteWatch",
  outputBase: "tests/resources/taskCompleteWatch",
  watch: "tests/resources/taskCompleteWatch/input",
  output: {
    "output/join1.txt": {
      id:"1",
      input: {
        "input/**.txt": true
      }
    }
  },
  tasks: {
    "task1": {
      use: async function () {
        await waitTest(10);
        await mkDirRecursive("tests/resources/taskCompleteWatch/output");
        await writeFile("tests/resources/taskCompleteWatch/output/task1.txt", "abc");
      },
      after: "1"
    }
  }
}

function waitTest(amount) {
  return new Promise((resolve, reject) => {
      amount = amount || 1;
      setTimeout(() => {
          resolve("Waited for");
      }, (500 * amount));
  });
}

async function mkDirRecursive(folder) {
  return new Promise(async (resolve, reject) => {
    try {
      var existingFolder = await getExistingPath(folder);
      while (existingFolder.pending.length > 0) {
        var current = existingFolder.pending.pop();
        existingFolder.base = path.join(existingFolder.base, current);
        try {
          await mkdir(existingFolder.base);
        } catch (error) {
          // If folder exists, do nothing
          if (error.code != 'EEXIST') {
            reject(error);
          }
        }
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
// @function getExistingPath (private) [Get exiting path from a folder and returns it with an array of folder to create inside]
async function getExistingPath(folder) {
  return new Promise(async (resolve, reject) => {
    try {
      var pending = [];
      var subFolder = folder;
      while (!await exists(subFolder)) {
        pending.push(path.basename(subFolder));
        subFolder = path.dirname(subFolder);
      }
      resolve({
        pending: pending,
        base: subFolder
      });
    } catch (error) {
      reject(error);
    }
  });
}