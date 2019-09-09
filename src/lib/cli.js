const cli = require("@vimlet/cli").instantiate();
const watcher = require("@vimlet/commons-watcher");
const path = require("path");
const fs = require("fs");
const pack = require("./pack");
const loadash = require("lodash");
const packagejson = require("../../package.json");

module.exports = async function () {
  function handler(value) {
    return value.split(",");
  }
  cli
    .value("-c", "--config", "Defines the configuration file path")
    .value("-w", "--watch", "Watched files will trigger build", handler)
    .value("-r", "--run", "Run tasks by id", handler)
    .flag("-h", "--help", "Shows help")
    .flag("-v", "--version", "Shows version")
    .parse(process.argv);

  let configPath = path.join(process.cwd(), "bundl.config.js");


  if (cli.result.help) {
    cli.printHelp();
  } else {
    if (cli.result.version) {
      console.log(`v${packagejson.version}`);
    } else {
      if (cli.result.config) {
        configPath = path.resolve(cli.result.config);
      }
      if (fs.existsSync(configPath)) {
        let config = require(configPath);
        let watchPath = cli.result.watch || config.watch;
        let run = cli.result.run;
    
        if (run) {
          await pack.runTask(loadash.cloneDeep(config), run);          
        } else {
          await pack.build(loadash.cloneDeep(config));
          if (watchPath) {
            console.log(`Watching ${watchPath}...`)
            watcher.watch(watchPath, {
              ignoreInitial: true
            }, function (error, data) {
              if (!error) {
                pack.buildSingle(loadash.cloneDeep(config), data.path, data.event);
              }
            });
          }
        }

      } else {
        console.log("Config file bundl.config.js not found, please create one!");
        process.exit(1);
      }
    }
  }

};