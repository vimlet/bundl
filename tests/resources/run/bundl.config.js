const { promisify } = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);
const path = require("path");

module.exports = {
    inputBase:"tests/resources/run",
    outputBase:"tests/resources/run",
    "tasks": {
      "run1":{
        use: async function(){
          await mkDirRecursive("tests/resources/run/output");
          await writeFile("tests/resources/run/output/run1.txt", "abc");
        }
      },
      "run2":{
        use: [async function(){
          return "a";
        },async function(prev){
          return prev + "b";
        },async function(prev){
          return prev + "c";
        },async function(prev){          
          await mkDirRecursive("tests/resources/run/output");
          await writeFile("tests/resources/run/output/run2.txt", prev);
        }]
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
