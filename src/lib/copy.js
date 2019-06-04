const path = require("path");
const util = require("./util");

module.exports.process = async (config, outputKey) => {
  let outputEntry = config.output[outputKey];
  outputKey = config.inputBase ? path.join(config.inputBase, outputKey) : outputKey;
  let copyPromises = [];
  let outputBase = path.join(config.outputBase, outputKey.replace("**", "")).replace(/\\/g, "/");
  let inputsObject = outputEntry.input;
  if(config.inputBase){
    var res = {};
    for(var key in inputsObject){
      res[path.join(config.inputBase, key).replace(/\\/g, "/")] = inputsObject[key];
    }
    inputsObject = res;
  }

  let files = await util.filesByMatches(await util.getInputMatches(inputsObject));

  files.map(file => {
    copyPromises.push(new Promise((resolve, reject) => {
      let subPath = file.match.substring(path.dirname(file.pattern).length + 1);
      let outputPath = path.join(outputBase, subPath).replace(/\\/g, "/");
      let outputParent = path.dirname(outputPath).replace(/\\/g, "/");

      let result = {
        parse: outputEntry.parse,
        outputParent: outputParent,
        outputPath: outputPath,
        content: file.content
      };

      resolve(result);
    }));
  });

  return copyPromises;
};