const clean = require("./clean");
const transform = require("./transform");
const copy = require("./copy");
const late = require("./late");

module.exports.build = async config => {
  console.log("Build started...");

  config.hashLength = "hashLength" in config ? config.hashLength : 7;
  config.clean = "clean" in config ? config.clean : true;
  config.basedir = "basedir" in config ? config.basedir : "";

  let hashes = {};
  let processOutputPromises = [];

  // Clean baseDir
  await clean(config);

  // Process copy and transform actions
  Object.keys(config.output).map(outputKey => {
    var isCopy = outputKey.endsWith("**");
    if (isCopy) {
      processOutputPromises.push(copy.process(config, outputKey));
    } else {
      processOutputPromises.push(transform.process(config, outputKey, hashes));
    }
  });

  // Flatten results nested arrays
  let processOutputResults = (await Promise.all(processOutputPromises))
    .reduce((prev, current) => {
      if (Array.isArray(current)) {
        current.map(result => {
          prev.push(result);
        });
      } else {
        prev.push(current);
      }
      return prev;
    }, []);

  // Finally process late actions (hash-parse and write)
  await late.process(processOutputResults, hashes);
  console.log("Build completed!");


};


