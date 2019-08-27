const md5 = require("md5");
const path = require("path");
const util = require("./util");
const parse = require("./parse");
const bundl = require("../index.js");

// @function processInputUse (private) [Apply use functions to input] @param inputsObject @param file
async function processInputUse(inputsObject, files) {
  files = await Promise.all(files.map(async file => {
    file.path = file.file;
    delete file.file;    
    if (inputsObject[file.pattern] instanceof Object && inputsObject[file.pattern].use) {
      if (Array.isArray(inputsObject[file.pattern].use)) {
        for(const func of inputsObject[file.pattern].use){
          file = await func(file,bundl);
        }
        return await file;
      } else {
        return await inputsObject[file.pattern].use(file,bundl);
      }
    }
    return file;
  }));
  return files;
}

// @function processInputJoin (private) [Join given files content for output] @param files @param inputsObject @param hashes @param outputParse
async function processInputJoin(files, inputsObject, hashes, outputParse) {
  return await files.reduce(async (total, current, index, array) => {    
    current.content = await processInputMeta(current, inputsObject, hashes, parse);
    return await total + current.content + (index < (array.length - 1) ? "\n" : "");
  }, "");
}

// @function processInputMeta (private) [Process meta] @para, file @param inputsObject @param hashes @param outputParse
async function processInputMeta(file, inputsObject, hashes, outputParse) {  
  if ((typeof inputsObject[file.pattern] === "object" && !Array.isArray(inputsObject[file.pattern]) && inputsObject[file.pattern].parse) || outputParse) {    
    content = await parse(file.content.toString(), {
      data: {
        hashes: hashes
      },
      basePath: path.dirname(file.path).replace(/\\/g, "/")
    });
    return content;
  } else {    
    return file.content.toString();
  }
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
        path: result.path,
        content: result.content
      },bundl);
    }
  }  
  return result.content;
};

// @function handleOutputHash (private) [Generate hash for file name] @param config @param hashes @param content @param outputKey @param outputObject @param outputPath
function handleOutputHash(config, hashes, content, outputKey, outputObject, outputPath) {
  if (outputKey.includes("{{hash}}")) {
    let hash = md5(content).substring(0, config.hashLength);
    hashes[outputPath] = hash;
    if (outputObject.id) {
      hashes[outputObject.id] = hash;
    }    
    outputPath = outputPath.replace("{{hash}}", hash);
  }
  return outputPath;
}


// @function process (public) [Process given output transform entry] @param config @param outputEntry
module.exports.process = async (config, outputObject, hashes) => {  
  // Read input files by match
  let outputPath = path.join(config.outputBase, outputObject.outPath).replace(/\\/g, "/");
  let outputParent = path.dirname(outputPath).replace(/\\/g, "/");
  let inputsObject = outputObject.input;
  let files = await util.filesByMatches(await util.getInputMatches(inputsObject, {
    path: config.inputBase
  }), inputsObject);  
  // Process input
  files = await processInputUse(inputsObject, files);
  let content = await processInputJoin(files, inputsObject, hashes, outputObject.parse);  
  // Process output
  content = await processOutputUse(outputObject, outputPath, content);
  // Enable hashing support
  outputPath = handleOutputHash(config, hashes, content, outputObject.outPath, outputObject, outputPath);
  
  // Return result
  let result = {
    parse: outputObject.parse,
    outputParent: outputParent,
    outputPath: outputPath,
    content: content
  };
  return result;
};