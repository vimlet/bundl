const path = require("path");
const util = require("./util");
const parse = require("./parse");

// @function processInputUse (private) [Apply use functions to input]
function processInputUse(inputsObject, file, outputPath) {  
  if (inputsObject[file.pattern] instanceof Object && inputsObject[file.pattern].use) {    
    if (Array.isArray(inputsObject[file.pattern].use)) {      
      inputsObject[file.pattern].use.forEach(func => {        
        file = func({
          match: file.match,
          pattern:file.pattern,
          file: file.file,
          content:file.content,
          fileName: file.fileName || outputPath
        });
      });
    } else {        
      file = inputsObject[file.pattern].use({
        match: file.match,
        pattern:file.pattern,
        file: file.file,
        content:file.content,
        fileName: file.fileName || outputPath
      });
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
module.exports.process = async (config, outputEntry) => {
  let copyPromises = [];
  let outputBase = path.join(config.outputBase, outputEntry.outPath.replace("**", "")).replace(/\\/g, "/");
  let inputsObject = outputEntry.input;
  let files = await util.filesByMatches(await util.getInputMatches(inputsObject, {
    path: config.inputBase
  }), inputsObject);  
  await Promise.all(files.map(async file => {
    let subPath = file.match.substring(path.dirname(file.pattern).length + 1);
    let outputPath = path.join(outputBase, subPath).replace(/\\/g, "/");
    file = await processInputUse(inputsObject, file, outputPath);    
    outputPath = file.fileName || outputPath;    
    copyPromises.push(new Promise(async (resolve, reject) => {
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
  }));
  return copyPromises;
};