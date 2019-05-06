const glob = require("@vimlet/commons-glob");
const promisify = require("util").promisify;
const fs = require("fs");
const readFile = promisify(fs.readFile);

module.exports.getInputMatches = async (outputEntry, inputsObject) => {
  let inputPatterns = Object.keys(inputsObject).filter(entry => outputEntry.input[entry]);
  return await glob.files(inputPatterns);
};

module.exports.filesByMatches = (matches) => {
  let files = [];
  matches.map(match => {
    files.push(new Promise((resolve, reject) => {
      readFile(match.file)
        .then(content => {
          match.content = content;
          resolve(match);
        })
        .catch(error => {
          reject(error);
        });
    }));
  });
  return Promise.all(files);
};
