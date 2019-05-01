const glob = require("@vimlet/commons-glob");
const md5 = require("md5");
const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const rimraf = require("rimraf");
const transform = require("./transform");

async function getInputMatches(outputEntry, inputsObject) {
  let inputPatterns = Object.keys(inputsObject).filter(entry => outputEntry.input[entry]);
  return await glob.files(inputPatterns);
}

function filesByMatches(matches) {
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

function handleOutputHash(config, hashes, content, outputKey, outputEntry, outputPath) {
  if (outputKey.includes("{{hash}}")) {
    let hash = md5(content).substring(0, config.hashLength);
    hashes[outputPath] = hash;
    if (outputEntry.id) {
      hashes[outputEntry.id] = hash;
    }
    outputPath = outputPath.replace("{{hash}}", hash);
  }
  return outputPath;
}

async function writeResult(result) {
  if (!await exists(result.outputParent)) {
    try {
      await mkdir(result.outputParent);
    } catch (error) {
      // Ignore error since sibling files will try to create the same directory
    }
  }
  await writeFile(result.outputPath, result.content);
  console.log(`-> ${result.outputPath}`);
}

module.exports.build = async config => {
  let hashes = {};
  config.hashLength = "hashLength" in config ? config.hashLength : 7;
  config.clean = "clean" in config ? config.clean : true;
  config.basedir = "basedir" in config ? config.basedir : "";

  // Clean basedir before build
  if (config.clean && config.basedir != "" && await exists(config.basedir)) {
    rimraf.sync(config.basedir);
  }

  let processPromises = [];
  let latePromises = [];

  Object.keys(config.output).map(outputKey => {
    let process = async () => {
      // Read input files by match
      let outputPath = path.join(config.basedir, outputKey).replace(/\\/g, "/");
      let outputParent = path.dirname(outputPath).replace(/\\/g, "/");
      let outputEntry = config.output[outputKey];
      let inputsObject = outputEntry.input;
      let files = await filesByMatches(await getInputMatches(outputEntry, inputsObject));
      files = transform.processInputUse(inputsObject, files);

      // Process content
      let content = transform.processInputJoin(files);      
      content = transform.processOutputUse(outputEntry, outputPath, content);
      content = await transform.processOutputMeta(outputEntry, hashes, content);
      
      // Enable hashing support
      outputPath = handleOutputHash(config, hashes, content, outputKey, outputEntry, outputPath);

      // Return result
      let result = {
        parse: outputEntry.parse,
        outputParent: outputParent,
        outputPath: outputPath,
        content: content
      };

      return result;
    };

    // Store process promise
    processPromises.push(process());
  });

  // Once all files are processed apply start late operations
  let processResults = await Promise.all(processPromises);
  processResults.map(result => {
    let late = async () => {
      // Use meta to replace hashes
      result = await transform.processLateMetaHash(hashes, result);
      // Write results to disk
      await writeResult(result);
      return result;
    };
    latePromises.push(late());
  });

  // Wait to late operations completion
  await Promise.all(latePromises);
};

