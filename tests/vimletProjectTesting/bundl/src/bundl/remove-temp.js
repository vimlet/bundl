const rimraf = require("rimraf");

module.exports = async function (entry, bundl) {
  try {
    // Remove bundl temporary directory
    var temp = "./release/temp";
    rimraf.sync(temp);

  } catch (error) {
    console.log(error);
  }
  return entry;
};