const glob = require("@vimlet/commons-glob");
const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

// Create a promise array of readFile
function readFiles(paths) {
  return Promise.all(paths.map(p => readFile(p)));
};

module.exports.processOutput = config => {
  Object.keys(config.output).map(async outputPath => {
    let outputEntry = config.output[outputPath];
    let outputParent = path.dirname(outputPath);
    let paths = (await glob.files(Object.keys(outputEntry.input))).map(entry => entry.file); 
    // Join input file content
    let content = (await readFiles(paths)).reduce((total, current, index, array) => {
      return total + current.toString() + (index < (array.length - 1) ? "\n" : "");
    }, "");
    // Write content to output file
    if(!await exists(outputParent)){
      await mkdir(outputParent);
    }
    writeFile(outputPath, content);
    console.log(`-> ${outputPath}`);
  });   
};

