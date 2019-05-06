const path = require("path");
const copy = require("@vimlet/commons-copy")

module.exports.process = async function(config, outputKey, files) {
  // let outputKey = outputKey.replace("**", "");
  // let outputPath = path.join(config.basedir, outputKey).replace(/\\/g, "/");

  
  files.map(file => {
    console.log(file.match);
  });


  
};
