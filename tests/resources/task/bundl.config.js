const {
  promisify
} = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);
const path = require("path");

module.exports = {
  inputBase: "tests/resources/task",
  outputBase: "tests/resources/task",
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
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task1.txt", "abc");
      },
      after: "1"
    },
    "task2": {
      use: async function () {
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task2.txt", "abc");
      }
    },
    "task3": {
      use: async function () {
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task3.txt", "abc");
        await waitTest(11);
      }
    },
    "task4": {
      use: async function () {
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task4.txt", "abc");
        await waitTest(11);
      }
    },
    "task5": {
      use: async function () {       
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task5.txt", "abc");
        await waitTest(11);
        
      }
    },
    "task6": {
      use: async function () {
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task6.txt", "abc");
        await waitTest(11);
      }
    },
    "task7": {
      runs: "task3 task4",
      after: "1"
    },
    "task8": {
      runp: "task5 task6",
      after: "1"
    },
    "task9": {
      use: async function () {
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task9.txt", "abc");
        await waitTest(11);
      }
    },
    "task10": {
      use: async function () {
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task10.txt", "abc");
        await waitTest(11);
      }
    },
    "task11": {
      use: async function () {     
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task11.txt", "abc");
        await waitTest(11);
        
      }
    },
    "task12": {
      use: async function () {
        await mkDirRecursive("tests/resources/task/output");
        await writeFile("tests/resources/task/output/task12.txt", "abc");
        await waitTest(11);
      }
    },
    "task13": {
      runs: "task9 task10",
      runp: "task11 task12",
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