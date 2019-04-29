const glob = require("@vimlet/commons-glob");
const meta = require("@vimlet/meta");
const md5 = require("md5");
const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const parse = promisify(meta.parse);
const rimraf = require("rimraf");

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

module.exports.build = config => {
  var hashes = {};
  config.hashLength = "hashLength" in config ? config.hashLength : 7;
  config.clean = "clean" in config ? config.clean : true;
  config.basedir = "basedir" in config ? config.basedir : "";

  // Clean basedir before build
  if (config.clean && config.basedir != "" && fs.existsSync(config.basedir)) {
    rimraf.sync(config.basedir);
  }

  Object.keys(config.output).map(async outputKey => {
    // Read input files by match
    let outputPath = path.join(config.basedir, outputKey).replace(/\\/g, "/");
    let outputParent = path.dirname(outputPath).replace(/\\/g, "/");
    let outputEntry = config.output[outputKey];    
    let inputsObject = outputEntry.input;
    let inputPatterns = Object.keys(inputsObject).filter(entry => outputEntry.input[entry]);
    let inputMatches = await glob.files(inputPatterns);
    let files = await filesByPattern(inputMatches);
    // Apply per file use filter
    files = files.map(file => {
      if (inputsObject[file.match] instanceof Object && inputsObject[file.match].use) {
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
    if (outputEntry.use) {
      content = outputEntry.use({
        file: outputPath,
        content: content
      }).content;
    }
    // Enable hashing support
    if (outputKey.includes("{{hash}}")) {
      let hash = md5(content).substring(0, config.hashLength);
      hashes[outputPath] = hash;
      if (outputEntry.id) {
        hashes[outputEntry.id] = hash;
      }
      outputPath = outputPath.replace("{{hash}}", hash);
    }
    // Meta parse per output file
    if (outputEntry.parse) {
      content = await parse(content, {
        data: {
          hashes: hashes
        }
      });
    }
    // Write content to output file
    if (!await exists(outputParent)) {
      try {
        await mkdir(outputParent);
      } catch (error) {
        // Ignore error since sibling files will try to create the same directory
      }
    }
    await writeFile(outputPath, content);
    console.log(`-> ${outputPath}`);
  });
};

