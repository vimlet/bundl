const md5 = require("md5");
const path = require("path");
const util = require("./util");
const parse = require("./parse");
const run = require("@vimlet/commons-run");

async function processInputUse(inputsObject, files) {
  files = await Promise.all(files.map(file => {
    file.path = file.file;
    delete file.file;
    if (inputsObject[file.match] instanceof Object && inputsObject[file.match].use) {
      if (Array.isArray(inputsObject[file.match].use)) {
        inputsObject[file.match].use.forEach(func => {
          file = func(file,run);
        });
        return file;
      } else {
        return inputsObject[file.match].use(file,run);
      }
    }
    return file;
  }));
  return files;
}

async function processInputJoin(files, inputsObject, hashes) {
  return await files.reduce(async (total, current, index, array) => {    
    current.content = await processInputMeta(current, inputsObject, hashes);
    return await total + current.content + (index < (array.length - 1) ? "\n" : "");
  }, "");
}

async function processInputMeta(file, inputsObject, hashes) {  
  if (typeof inputsObject[file.pattern] === "object" && !Array.isArray(inputsObject[file.pattern]) && inputsObject[file.pattern].parse) {
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

async function processOutputUse(outputObject, outputPath, content) {
  var result;
  if (outputObject.use) {
    if (Array.isArray(outputObject.use)) {
      for (var i = 0; i < outputObject.use.length; i++) {
        result = await outputObject.use[i]({
          path: outputPath,
          content: content
        },run);
      }
    } else {
      result = await outputObject.use({
        path: outputPath,
        content: content
      },run);
    }
  }else{
    result = {
      path: outputPath,
      content:content
    }
  }  
  return result.content;
};


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
  let content = await processInputJoin(files, inputsObject, hashes);  
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