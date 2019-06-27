const promisify = require("util").promisify;
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const parse = require("./parse");

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
      await mkdir(result.outputParent, {
        recursive: true
      });
    } catch (error) {      
      // Ignore error since sibling files will try to create the same directory
    }
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