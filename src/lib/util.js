const glob = require("@vimlet/commons-glob");
const { promisify } = require("util");
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


// @function getTime (public) [Return current time]
module.exports.getTime = function() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  var minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var seconds = today.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  today = dd + '/' + mm + '/' + yyyy + "/" + hours + ":" + minutes + ":" + seconds;
  return today;
};