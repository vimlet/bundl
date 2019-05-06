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

async function writeResult(result) {
  if (!await exists(result.outputParent)) {
    try {
      await mkdir(result.outputParent);
    } catch (error) {
      // Ignore error since sibling files will try to create the same directory
    }
  }
  await writeFile(result.outputPath, result.content);
  console.log(`-> ${result.outputPath}`);
}

module.exports.process = async (results, hashes) => {  
  let latePromises = [];

  results.map(result => {
    let late = async () => {
      // Use meta to replace hashes
      result = await processLateMetaHash(hashes, result);
      // Write results to disk
      await writeResult(result);
      return result;
    };
    latePromises.push(late());
  });

  await Promise.all(latePromises);
};
