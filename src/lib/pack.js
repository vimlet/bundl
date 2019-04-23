const glob = require("@vimlet/commons-glob");
const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

function filesByPattern(matches) {
  var files = [];
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

module.exports.processOutput = config => {
  Object.keys(config.output).map(async outputPath => {
    // Read input files by match
    let outputEntry = config.output[outputPath];
    let outputParent = path.dirname(outputPath);
    let inputsObject = outputEntry.input;
    let inputPatterns = Object.keys(inputsObject).filter(entry => outputEntry.input[entry]);
    // TODO enforce glob order!!!
    let inputMatches = await glob.files(inputPatterns);
    let files = await filesByPattern(inputMatches);
    // Apply per file use filter
    files = files.map(file => {
      if(inputsObject[file.match] instanceof Object && inputsObject[file.match].use) {
        return inputsObject[file.match].use(file);
      }
      return file;
    });
    // Join input file content
    let content = files.reduce((total, current, index, array) => {
      // TODO current should be handled as a promise
      return total + current.content.toString() + (index < (array.length - 1) ? "\n" : "");
    }, "");
    // Apply per output use filter
    if(outputEntry.use) {
      content = outputEntry.use({
        file: outputPath,
        content: content
      }).content;
    }
    // Write content to output file
    if(!await exists(outputParent)){
      await mkdir(outputParent);
    }
    writeFile(outputPath, content);
    console.log(`-> ${outputPath}`);
  });
};

