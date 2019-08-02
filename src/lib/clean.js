const promisify = require("util").promisify;
const fs = require("fs");
const exists = promisify(fs.exists);
const fsRemove = promisify(fs.unlink);
const rimraf = require("rimraf");
const path = require("path");
const glob = require("@vimlet/commons-glob");
const util = require("./util");

const cwd = process.cwd();

module.exports = async config => {
  if (config.clean && config.outputBase) {
    if (!config._isWatch) {
      rimraf.sync(path.resolve(config.outputBase));
    } else {
      var generatedFiles = await getGeneratedFiles(config);
      await clean(config, generatedFiles);
    }
  }

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
  async function getGeneratedFiles() {
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
            for(const cInput of current.input){
              await getCopyFiles(config, cInput, generatedFiles.noHash);  
            }            
          }
        } else {
          for (const cur of current) {
            if (!Array.isArray(cur.input)) {
              await getCopyFiles(config, key, cur.input, generatedFiles.noHash);
            } else {
              for(const cInput of cur.input){
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
};

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
