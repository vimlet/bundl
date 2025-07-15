const {
  promisify
} = require("util");
const fs = require("fs");
const exists = promisify(fs.exists);
const fsRemove = promisify(fs.unlink);
const rimraf = require("rimraf");
const path = require("path");
const glob = require("@vimlet/commons-glob");
const util = require("./util");

module.exports = async (config, options) => {
  if (config.clean && typeof config.clean == "boolean") {
    if (config.clean && config.outputBase) {
      if (!config._isWatch) {
        rimraf.sync(path.resolve(config.outputBase));
      } else {
        await cleanWatch(config, options);
      }
    }
  } else if (config.clean) {
    if (!Array.isArray(config.clean)) {
      config.clean = [config.clean];
    }
    if (!config._isWatch) {
      config.clean.forEach(element => {
        var currentFolder = config.outputBase ? path.join(config.outputBase, element) : path.resolve(element);
        rimraf.sync(currentFolder);
      });
    } else {
      await cleanWatch(config, options);
    }
  }
};

// @function cleanWatch (private) [Clean files triggered with watch] @param config @param options
async function cleanWatch(config, options) {
  if (options) {
    if (options.matches && options.filePath) {
      for (const outMatch of Array.isArray(options.matches) ? options.matches : []) {
        if (outMatch.endsWith("**")) {
          var inputs = config.output[outMatch].input;
          var currentInput;
          for (var inputKey in inputs) {
            if (typeof inputs[inputKey] === "object" &&
              !Array.isArray(inputs[inputKey]) && "watch" in inputs[inputKey]) {
              if (glob.match(options.filePath, inputs[inputKey].watch).length > 0) {
                currentInput = inputKey;
              }
            } else if (glob.match(options.filePath, inputKey).length > 0) {
              currentInput = inputKey;
            }
          }
          if (currentInput) {
            var relativePath = path.relative(currentInput.replace("**", "").replace(/\\/g, "/"), options.filePath);
            var pathToDelete = path.join(config.outputBase, outMatch.replace("**", "").replace(/\\/g, "/"), relativePath);
            if (await exists(pathToDelete)) {
              await fsRemove(pathToDelete);
            }
          }
        } else {
          if (outMatch.indexOf("{{hash}}") < 0) {
            var pathToDelete = path.join(config.outputBase, outMatch);
            if (await exists(pathToDelete)) {
              await fsRemove(pathToDelete);
            }
          } else {
            let outputPath = path.join(config.outputBase, outMatch).replace(/\\/g, "/");
            outputPath = escapeRegExp(outputPath);
            outputPath = outputPath.replace("\\{\\{hash\\}\\}", "[0-9a-zA-F]{" + config.hashLength + "}");
            let outputFiles = await glob.files(path.join(config.outputBase, "**").replace(/\\/g, "/"));
            var erasable = [];
            outputFiles.forEach(oF => {
              if (oF.match.match(new RegExp(outputPath, "g"))) {
                erasable.push(oF);
              }
            });
            for (const era of erasable) {
              if (await exists(era.file)) {
                await fsRemove(era.file);
              }
            }
          }
        }
      }
    }
  }
}


function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

// @function clean (private) [Delete files that not match generatedFiles] @param config @param generatedFiles [Array with path to the files that will be generated]
async function clean(config, generatedFiles) {
  let outputFiles = await glob.files(path.join(config.outputBase, "**").replace(/\\/g, "/"));
  await Promise.all(outputFiles.map(async oFile => {
    var markDelete = true;
    // If match noHash mark to not delete
    if (generatedFiles.noHash.indexOf(oFile.match) >= 0) {
      markDelete = false;
    }
    if (markDelete && generatedFiles.hash.length > 0) {
      // If it is still erasable, check if it matches any hash
      var gMatch = glob.match(oFile.match, generatedFiles.hash);
      if (gMatch.length > 0) {
        markDelete = false;
      }
    }
    if (markDelete) {
      await fsRemove(oFile.file);
    }
  }));
}

// @function getGeneratedFiles (private) [Get paths to the files that will be generated]
async function getGeneratedFiles(config) {
  var generatedFiles = {
    noHash: [],
    hash: []
  };
  for (var key in config.output) {
    if (key.endsWith("**")) {
      var current = config.output[key];
      if (!Array.isArray(current)) {
        if (!Array.isArray(current.input)) {
          await getCopyFiles(config, key, current.input, generatedFiles.noHash);
        } else {
          for (const cInput of current.input) {
            await getCopyFiles(config, cInput, generatedFiles.noHash);
          }
        }
      } else {
        for (const cur of current) {
          if (!Array.isArray(cur.input)) {
            await getCopyFiles(config, key, cur.input, generatedFiles.noHash);
          } else {
            for (const cInput of cur.input) {
              await getCopyFiles(config, cInput, generatedFiles.noHash);
            }
          }
        }
      }
    } else {
      let outputPath = path.join(config.outputBase, key).replace(/\\/g, "/");
      if (outputPath.indexOf("{{hash}}") < 0) {
        generatedFiles.noHash.push(outputPath);
      } else {
        generatedFiles.hash.push(outputPath.replace("{{hash}}", "**"));
      }
    }
  }
  return generatedFiles;
}

// @function getCopyFiles (private) [Get path to copy outputs and add them to generatedFiles array] @param config @param key [output key] @input @generatedFiles [Array to add files]
async function getCopyFiles(config, key, input, generatedFiles) {
  var files = await util.getInputMatches(input, {
    path: config.inputBase
  });
  files.forEach(file => {
    let subPath;
    if (path.basename(file.pattern) == file.pattern) {
      subPath = file.match.substring(0);
    } else {
      subPath = file.match.substring(path.dirname(file.pattern).length + 1);
    }
    let outputBase = path.join(config.outputBase, key.replace("**", "")).replace(/\\/g, "/");
    let outputPath = path.join(outputBase, subPath).replace(/\\/g, "/");
    generatedFiles.push(outputPath);
  });
}