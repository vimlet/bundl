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
          pattern: file.pattern,
          file: file.file,
          content: file.content,
          fileName: file.fileName || outputPath
        });
      });
    } else {
      file = inputsObject[file.pattern].use({
        match: file.match,
        pattern: file.pattern,
        file: file.file,
        content: file.content,
        fileName: file.fileName || outputPath
      });
    }
  }
  return file;
}


// @function processInputNameReplace (private) [Apply fileNameReplace to input]
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
// @function processOutputNameReplace (private) [Apply fileNameReplace to output]
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

// @function processInputMeta (private) [Process meta]
async function processInputMeta(file, inputsObject) {
  if (typeof inputsObject[file.pattern] === "object" && !Array.isArray(inputsObject[file.pattern]) && inputsObject[file.pattern].parse) {
    content = await parse(file.content.toString(), {
      basePath: path.dirname(file.file).replace(/\\/g, "/")
    });
    return content;
  } else {
    return file.content;
  }
}

module.exports.process = async (config, outputEntry) => {
  let copyPromises = [];
  let outputBase = path.join(config.outputBase, outputEntry.outPath.replace("**", "")).replace(/\\/g, "/");
  let inputsObject = outputEntry.input;
  let files = await util.filesByMatches(await util.getInputMatches(inputsObject, {
    path: config.inputBase
  }), inputsObject);
  await Promise.all(files.map(async file => {
    let suPath;
    if (path.basename(file.pattern) == file.pattern) {
      subPath = file.match.substring(0);
    } else {
      subPath = file.match.substring(path.dirname(file.pattern).length + 1);
    }
    let outputPath = path.join(outputBase, subPath).replace(/\\/g, "/");
    file = await processInputUse(inputsObject, file, outputPath);
    file.content = await processInputMeta(file, inputsObject);
    outputPath = file.fileName || outputPath;
    outputPath = processInputNameReplace(inputsObject, file, outputPath);
    copyPromises.push(new Promise(async (resolve, reject) => {
      let outputParent = path.dirname(outputPath).replace(/\\/g, "/");
      var usedData = await processOutputUse(outputEntry, outputPath, file.content);
      outputPath = processOutputNameReplace(outputEntry, outputPath);
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