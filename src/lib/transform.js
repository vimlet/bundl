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
        for (const func of inputsObject[file.pattern].use) {
          file = await func(file, bundl);
        }
        return await file;
      } else {
        return await inputsObject[file.pattern].use(file, bundl);
      }
    }
    return file;
  }));
  return files;
}

// @function processInputJoin (private) [Join given files content for output] @param files @param inputsObject @param meta @param outputParse
async function processInputJoin(files, inputsObject, meta, outputParse, config) {
  return await files.reduce(async (total, current, index, array) => {
    current.content = await processInputMeta(current, inputsObject, meta, outputParse), config;
    return await total + current.content + (index < (array.length - 1) ? "\n" : "");
  }, "");
}

// @function processInputMeta (private) [Process meta] @para, file @param inputsObject @param meta @param outputParse
async function processInputMeta(file, inputsObject, meta, outputParse, config) {
  if ((typeof inputsObject[file.pattern] === "object" && !Array.isArray(inputsObject[file.pattern]) && inputsObject[file.pattern].parse) || outputParse) {
    var data = { __meta: meta };
    if (outputParse && typeof outputParse === "object") {
      for (var key in outputParse) {
        data[key] = outputParse[key];
      }
    }
    if (inputsObject[file.pattern].parse && typeof inputsObject[file.pattern].parse === "object") {
      for (var key in inputsObject[file.pattern].parse) {
        data[key] = inputsObject[file.pattern].parse[key];
      }
    }
    
    content = await parse(file.content.toString(), {
      data: data,
      basePath: path.dirname(file.path).replace(/\\/g, "/"),
      errorManaging: config.errorManaging || "strict"
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
    content: content
  };
  if (outputObject.use) {
    if (Array.isArray(outputObject.use)) {
      for (var i = 0; i < outputObject.use.length; i++) {
        result = await outputObject.use[i]({
          path: result.path,
          content: result.content
        }, bundl);
      }
    } else {
      result = await outputObject.use({
        path: result.path,
        content: result.content
      }, bundl);
    }
  }
  return result.content;
};

// @function handleOutputMeta (private) [Generate hash for file name] @param config @param meta @param content @param outputKey @param outputObject @param outputPath
function handleOutputMeta(config, meta, content, outputKey, outputObject, outputPath) {
  if (outputKey.includes("{{hash}}")) {
    let hash = md5(content).substring(0, config.hashLength);
    var file = outputKey.replace("{{hash}}", hash);
    var filename = path.basename(file);
    meta[outputPath] = meta[outputPath] || {};
    meta[outputPath].hash = hash;
    meta[outputPath].file = file;
    meta[outputPath].filename = filename;
    if (outputObject.id) {
      meta[outputObject.id] = meta[outputObject.id] || {};
      meta[outputObject.id].hash = hash;
      meta[outputObject.id].file = file;
      meta[outputObject.id].filename = filename;
    }
    outputPath = outputPath.replace("{{hash}}", hash);
  }
  return outputPath;
}


// @function process (public) [Process given output transform entry] @param config @param outputEntry @param meta
module.exports.process = async (config, outputObject, meta) => {
  // Read input files by match
  let outputPath = path.join(config.outputBase, outputObject.outPath).replace(/\\/g, "/");
  let outputParent = path.dirname(outputPath).replace(/\\/g, "/");
  let inputsObject = outputObject.input;
  var keepSort = "keepSort" in outputObject ? outputObject.keepSort : true;
  let files = await util.filesByMatches(await util.getInputMatches(inputsObject, {
    path: config.inputBase, keepSort: keepSort
  }), inputsObject);
  // Process input
  files = await processInputUse(inputsObject, files);
  let content = await processInputJoin(files, inputsObject, meta, outputObject.parse, config);
  // Process output
  content = await processOutputUse(outputObject, outputPath, content);
  // Enable hashing support
  outputPath = handleOutputMeta(config, meta, content, outputObject.outPath, outputObject, outputPath);

  // Return result
  let result = {
    parse: outputObject.parse,
    outputParent: outputParent,
    outputPath: outputPath,
    content: content
  };
  return result;
};