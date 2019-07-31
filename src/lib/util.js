const glob = require("@vimlet/commons-glob");
const promisify = require("util").promisify;
const fs = require("fs");
const readFile = promisify(fs.readFile);

module.exports.getInputMatches = async (inputsObject, options) => {
  let inputPatterns = Object.keys(inputsObject).filter(entry => inputsObject[entry]);
  options.sort = true;
  return await glob.files(inputPatterns, options);
};

module.exports.filesByMatches = (matches, inputsObject) => {
  let files = [];
  matches.map(match => {
    files.push(new Promise((resolve, reject) => {
      if (inputsObject && inputsObject[match.pattern] instanceof Object && ("read" in inputsObject[match.pattern]) && !inputsObject[match.pattern].read) {
        match.content = "";
        resolve(match);
      } else {
        readFile(match.file)
          .then(content => {
            match.content = content;
            resolve(match);
          })
          .catch(error => {
            reject(error);
          });
      }
    }));
  });
  return Promise.all(files);
};