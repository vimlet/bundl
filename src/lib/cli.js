const cli = require("@vimlet/cli").instantiate();
const watcher = require("@vimlet/commons-watcher");
const path = require("path");
const fs = require("fs");
const pack = require("./pack");
const loadash = require("lodash");
const packagejson = require("../../package.json");

var watcherQueue = {};

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
                if (!watcherQueue[data.path]) {
                  watcherQueue[data.path] = {
                    path: data.path,
                    counter: 1
                  };
                  buildWatch(config,data);
                } else {
                  console.log("Change queued");                  
                  watcherQueue[data.path].counter = 2;
                }
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


// @function buildWatch (private) [Call build. When finish it will do a recursive call if more changes have been made while processing]
function buildWatch(config,data) {
  pack.buildSingle(loadash.cloneDeep(config), data.path, data.event).then(() => {
    if (watcherQueue[data.path]) {
      watcherQueue[data.path].counter = watcherQueue[data.path].counter - 1;
      if (watcherQueue[data.path].counter > 0) {
        buildWatch(config,data);
      } else {
        delete watcherQueue[data.path];
      }
    }
  }).catch((error) => {
    console.log("Error watching", error);
  });
}