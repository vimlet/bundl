const promisify = require("util").promisify;
const fs = require("fs");
const exists = promisify(fs.exists);
const rimraf = require("rimraf");
const path = require("path");
const glob = require("@vimlet/commons-glob");

module.exports = async config => {
  if (config.clean && config.outputBase) {
    rimraf.sync(path.resolve(config.outputBase));
  } else {
    for (var key in config.output) {
      if (!Array.isArray(config.output[key])) {
        config.output[key].clean = "clean" in config.output[key] ? config.output[key].clean : true;
        if (config.output[key].clean) {
          await doClean(config, key);
        }
      } else {
        await Promise.all(config.output[key].map(async function (cOut) {
          cOut.clean = "clean" in cOut ? cOut.clean : true;
          if (cOut.clean) {
            await doClean(config, key);
          }
        }));
      }
    }
  }
};

async function doClean(config, key) {
  var fullPath = config.outputBase ? path.join(config.outputBase, key.replace("**", "").replace(/\\/g, "/")) : key.replace("**", "").replace(/\\/g, "/");
  if (fullPath.indexOf("{{hash}}") < 0) {
    if (await exists(fullPath)) {
      rimraf.sync(fullPath);
    }
  } else {
    fullPath = fullPath.replace("{{hash}}", "**").replace(/\\/g, "/");
    var files = await glob.files(fullPath);
    files.forEach(element => {
      rimraf.sync(element.file);
    });
  }
}