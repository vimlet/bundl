const { promisify } = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);
const path = require("path");

module.exports = {
    inputBase:"tests/resources/taskOrder",
    outputBase:"tests/resources/taskOrder",
    output: {

        // --- Output String ---
        "output/taskOrder1.txt": "input/**.txt",

        // // ---  Output Object ---
        "output/taskOrder2.txt": {
            input: "input/**.txt",
            order:2
        },
        "output/taskOrder3.txt": {
            input: {
                "input/**.txt": true
            }
        },
        "output/taskOrder4.txt": {
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ]
        },
        
        // // --- Output Array ---
        "output/taskOrder5.txt": [
            "input/a.txt",
            "input/b.txt",
            "input/c.txt"
        ]
    },
    "task": {
      "taskOrder1":{
        use: async function(){
            await mkDirRecursive("tests/resources/taskOrder/output");
            await writeFile("tests/resources/taskOrder/output/task1.txt", "abc");      
        },
        order:1
      }
    }
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
