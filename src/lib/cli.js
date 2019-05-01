const cli = require("@vimlet/cli").instantiate();
const path = require("path");
const fs = require("fs");
const pack = require("./pack");

module.exports = function () {
  let configPath = path.join(process.cwd(), "metapack.js");

  cli
    .value("-c", "--config", "Defines the configuration file path")
    .flag("-h", "--help", "Shows help")
    .parse(process.argv);


  if (cli.result) {
    if (cli.result.help) {
      cli.printHelp();
    } else {
      if (cli.result.config) {
        configPath = cli.result.config;
      }
      if (fs.existsSync(configPath)) {
        let config = require(configPath);
        pack.build(config);
      } else {
        console.log("Config file metapack.js not found, please create one!");
        process.exit(1);
      }   
    }    
  }
};