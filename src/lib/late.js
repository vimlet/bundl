const { promisify } = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const parse = require("./parse");
const path = require("path");

async function processLateMetaHash(hashes, result) {
  if (result.parse) {
    result.content = await parse(result.content, {
      data: {
        hashParse: true,
        hashes: hashes
      }
    });
  }  
  return result;
};

async function writeResult(result, config) {
  if (!await exists(result.outputParent)) {
    try {
      await mkDirRecursive(result.outputParent);
    } catch (error) {
      // Ignore error since sibling files will try to create the same directory
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

  await writeFile(result.outputPath, result.content);
  if (!("log" in config) || config.log) {
    console.log(`-> ${result.outputPath}`);
  }
}

module.exports.process = async (results, hashes, config) => {
  let latePromises = [];

  results.map(result => {
    let late = async () => {
      // Use meta to replace hashes
      result = await processLateMetaHash(hashes, result);
      // Write results to disk
      await writeResult(result, config);
      return result;
    };
    latePromises.push(late());
  });

  await Promise.all(latePromises);
};