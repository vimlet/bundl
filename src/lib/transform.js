const md5 = require("md5");
const path = require("path");
const util = require("./util");
const parse = require("./parse");

function processInputUse(inputsObject, files) {
  files = files.map(file => {
    if (inputsObject[file.match] instanceof Object && inputsObject[file.match].use) {
      return inputsObject[file.match].use(file);
    }
    return file;
  });
  return files;
}

function processInputJoin(files) {
  return files.reduce((total, current, index, array) => {
    return total + current.content.toString() + (index < (array.length - 1) ? "\n" : "");
  }, "");
};

function processOutputUse(outputObject, outputPath, content) {
  if (outputObject.use) {
    content = outputObject.use({
      file: outputPath,
      content: content
    }).content;
  }
  return content;
};

async function processOutputMeta(outputObject, hashes, content) {
  if (outputObject.parse) {
    content = await parse(content, {
      data: {
        hashes: hashes
      }
    });
  }
  return content;
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

module.exports.process = async (config, outputKey, hashes) => {
  // Read input files by match
  let outputPath = path.join(config.basedir, outputKey).replace(/\\/g, "/");
  let outputParent = path.dirname(outputPath).replace(/\\/g, "/");
  let outputObject = config.output[outputKey];
  let inputsObject = outputObject.input;
  let files = await util.filesByMatches(await util.getInputMatches(outputObject, inputsObject));

  // Process input
  files = processInputUse(inputsObject, files);

  // Process output
  let content = processInputJoin(files);
  content = processOutputUse(outputObject, outputPath, content);
  content = await processOutputMeta(outputObject, hashes, content);

  // Enable hashing support
  outputPath = handleOutputHash(config, hashes, content, outputKey, outputObject, outputPath);

  // Return result
  let result = {
    parse: outputObject.parse,
    outputParent: outputParent,
    outputPath: outputPath,
    content: content
  };

  return result;
};



