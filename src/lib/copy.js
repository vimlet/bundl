const path = require("path");
const util = require("./util");
const glob = require("@vimlet/commons-glob");

// @function processInputUse (private) [Apply use functions to input]
function processInputUse(inputsObject, file) {
  if (inputsObject[file.pattern] instanceof Object && inputsObject[file.pattern].use) {
    if (Array.isArray(inputsObject[file.pattern].use)) {
      inputsObject[file.pattern].use.forEach(func => {
        file = func(file);
      });
    } else {
      file = inputsObject[file.pattern].use(file);
    }
  }
  return file;
}
// @function processOutputUse (private) [Apply use functions to output]
function processOutputUse(outputObject, outputPath, content) {  
  if (outputObject.use) {
    if (Array.isArray(outputObject.use)) {      
      outputObject.use.forEach(func => {    
        content = func({
          file: outputPath,
          fileName: outputPath,
          content: content
        });
      });
    } else {          
      content = outputObject.use({
        file: outputPath,
        fileName: outputPath,
        content: content
      });      
    }
  }  
  return content;
}

module.exports.process = async (config, outputKey) => {
  let outputEntry = config.output[outputKey];
  let copyPromises = [];
  let outputBase = path.join(config.outputBase, outputKey.replace("**", "")).replace(/\\/g, "/");
  let inputsObject = outputEntry.input;
  let files = await util.filesByMatches(await util.getInputMatches(inputsObject, {
    path: config.inputBase
  }));
  files.map(async file => {
    file = await processInputUse(inputsObject, file);    
    copyPromises.push(new Promise(async (resolve, reject) => {
      let subPath = file.match.substring(path.dirname(file.pattern).length + 1);
      let outputPath = path.join(outputBase, subPath).replace(/\\/g, "/");
      let outputParent = path.dirname(outputPath).replace(/\\/g, "/");
      var usedData = await processOutputUse(outputEntry, outputPath, file.content);      
      let result = {
        parse: outputEntry.parse,
        outputParent: outputParent,
        outputPath: usedData.fileName || outputPath,
        content: usedData.content || file.content
      };
      resolve(result);
    }));
  });
  return copyPromises;
};