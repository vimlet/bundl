const path = require("path");
const util = require("./util");
const parse = require("./parse");
const bundl = require("../index.js");

// @function processInputUse (private) [Apply use functions to input] @param inputsObject @param file
async function processInputUse(inputsObject, file) {
  file.path = file.match;
  if (inputsObject[file.pattern] instanceof Object && inputsObject[file.pattern].use) {
    if (Array.isArray(inputsObject[file.pattern].use)) {
      for(const func of inputsObject[file.pattern].use){
        file = await func({
          match: file.match,
          pattern: file.pattern,
          path: file.path,
          content: file.content
        },bundl);       
      }
    } else {
      file = await inputsObject[file.pattern].use({
        match: file.match,
        pattern: file.pattern,
        path: file.path,
        content: file.content
      },bundl);
    }
  }else{
    file.path = file.match;
  }
  delete file.file;
  return file;
}

// @function processInputNameReplace (private) [Apply fileNameReplace to input] @param inputsObject @param file @param outputPath
function processInputNameReplace(inputsObject, file, outputPath) {
  if (inputsObject[file.pattern] instanceof Object && inputsObject[file.pattern].fileNameReplace) {
    try {
      outputPath = outputPath.replace(inputsObject[file.pattern].fileNameReplace[0], inputsObject[file.pattern].fileNameReplace[1]);
    } catch (error) {
      console.log("Error, bad formatted fileNameReplace: " + inputsObject[file.pattern].fileNameReplace);
    }
  }
  return outputPath;
}

// @function processOutputUse (private) [Apply use functions to output] @param outputObject @param outputPath @param content
async function processOutputUse(outputObject, outputPath, content) {
  var result = {
    path: outputPath,
    content:content
  };
  if (outputObject.use) {
    if (Array.isArray(outputObject.use)) {      
      for (var i = 0; i < outputObject.use.length; i++) {
        result = await outputObject.use[i]({
          path: result.path,
          content: result.content
        },bundl);
      }
    } else {
      result = await outputObject.use({
        path: outputPath,
        content: content
      },bundl);
    }
  }
  return result;
}

// @function processOutputNameReplace (private) [Apply fileNameReplace to output] @param outputObject @param outputPath
function processOutputNameReplace(outputObject, outputPath) {  
  if (outputObject.fileNameReplace) {
    try {
      outputPath = outputPath.replace(outputObject.fileNameReplace[0], outputObject.fileNameReplace[1]);
    } catch (error) {
      console.log("Error, bad formatted fileNameReplace: " + outputObject.fileNameReplace);
    }
  }
  return outputPath;
}

// @function processInputMeta (private) [Process meta] @para, file @param inputsObject @param cwdFilePath
async function processInputMeta(file, inputsObject, cwdFilePath) {  
  if (typeof inputsObject[file.pattern] === "object" && !Array.isArray(inputsObject[file.pattern]) && inputsObject[file.pattern].parse) {
    content = await parse(file.content.toString(), {
      basePath: path.dirname(cwdFilePath).replace(/\\/g, "/")
    });
    return content;
  } else {
    return file.content;
  }
}

// @function process (public) [Process given output copy entry] @param config @param outputEntry
module.exports.process = async (config, outputEntry) => {  
  let copyPromises = [];
  let outputBase = path.join(config.outputBase, outputEntry.outPath.replace("**", "")).replace(/\\/g, "/");
  let inputsObject = outputEntry.input;
  let files = await util.filesByMatches(await util.getInputMatches(inputsObject, {
    path: config.inputBase
  }), inputsObject);
  await Promise.all(files.map(async file => {
    var cwdFilePath = file.file;
    file = await processInputUse(inputsObject, file);         
    file.content = await processInputMeta(file, inputsObject, cwdFilePath);    
    let subPath;    
    if (path.basename(file.pattern) == file.pattern) {
      subPath = file.path.substring(0);
    } else {
      subPath = file.path.substring(path.dirname(file.pattern).length + 1);
    }
    let outputPath = path.join(outputBase, subPath).replace(/\\/g, "/");
    outputPath = processInputNameReplace(inputsObject, file, outputPath);
    copyPromises.push(new Promise(async (resolve, reject) => {
      let outputParent = path.dirname(outputPath).replace(/\\/g, "/");
      var usedData = await processOutputUse(outputEntry, outputPath, file.content);            
      usedData.path = processOutputNameReplace(outputEntry, usedData.path);
      let result = {
        parse: outputEntry.parse,
        outputParent: outputParent,
        outputPath: usedData.path,
        content: usedData.content || file.content
      };
      resolve(result);
    }));
  }));
  return copyPromises;
};