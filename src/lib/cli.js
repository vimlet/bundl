const cli = require("@vimlet/cli").instantiate();
const watcher = require("@vimlet/commons-watcher");
const path = require("path");
const fs = require("fs");
const pack = require("./pack");

module.exports = async function () {
  cli
    .value("-c", "--config", "Defines the configuration file path")
    .value("-w", "--watch", "Watched files will trigger build")
    .flag("-h", "--help", "Shows help")
    .parse(process.argv);

  let configPath = path.join(process.cwd(), "metapack.js");
  
  
  if (cli.result.help) {
    cli.printHelp();
  } else {
    if (cli.result.config) {
      configPath = cli.result.config;
    }
    if (fs.existsSync(configPath)) {
      let config = require(configPath);
      let watchPath = cli.result.watch || config.watch;

      await pack.build(config);
      
      if (watchPath) {
        console.log(`Watching ${watchPath}...`)
        watcher.watch(watchPath, {
          ignoreInitial: true
        }, function (error, data) {
          if (!error) {
            // TODO should not build all, only affected input files
            pack.build(config);
          }
        });
      }

    } else {
      console.log("Config file metapack.js not found, please create one!");
      process.exit(1);
    }
  }

};