const path = require("path");
const util = require("./util");

module.exports.process = async (config, outputKey) => {
  let copyPromises = [];

  let outputBase = path.join(config.basedir, outputKey.replace("**", "")).replace(/\\/g, "/");
  let outputEntry = config.output[outputKey];
  let inputsObject = outputEntry.input;

  let files = await util.filesByMatches(await util.getInputMatches(outputEntry, inputsObject));

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