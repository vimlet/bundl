const promisify = require("util").promisify;
const fs = require("fs");
const exists = promisify(fs.exists);
const rimraf = require("rimraf");
const path = require("path");
const glob = require("@vimlet/commons-glob");

module.exports = async (config, outputKey) => {
  // Clean basedir before build
  // if (config.clean && config.basedir != "" && await exists(config.basedir)) {
  //   rimraf.sync(config.basedir);
  // }


  if (config.output[outputKey].clean) {
    var fullPath = config.basedir ? path.join(config.basedir, outputKey.replace("**", "").replace(/\\/g, "/")) : outputKey.replace("**", "").replace(/\\/g, "/");
    // console.log("FULLPATH", fullPath);
    if (fullPath.indexOf("{{hash}}") < 0) {
      if (await exists(fullPath)) {
        rimraf.sync(fullPath);
      }
    } else {
      fullPath = fullPath.replace("{{hash}}", "**");
      var files = await glob.files(fullPath);
      
      
      // console.log('C:/Users/jpere/Documents/NetbeansProjects/metapack/test/output/test/build.efe8740.js'.match(/test\output\test\build.**.js/));
      console.log("FILES", fullPath, files);

    }
  }

};