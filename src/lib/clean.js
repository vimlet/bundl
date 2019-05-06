const promisify = require("util").promisify;
const fs = require("fs");
const exists = promisify(fs.exists);
const rimraf = require("rimraf");

module.exports = async config => {  
  // Clean basedir before build
  if (config.clean && config.basedir != "" && await exists(config.basedir)) {
    rimraf.sync(config.basedir);
  }
};