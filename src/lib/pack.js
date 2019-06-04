const clean = require("./clean");
const transform = require("./transform");
const copy = require("./copy");
const late = require("./late");

module.exports.build = async config => {
  console.log("Build started...");

  config = setupConfig(config);

  let hashes = {};
  let processOutputPromises = [];

  await clean(config);

  // Process copy and transform actions
  Object.keys(config.output).map(async outputKey => {
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


function setupConfig(config) {
  config.hashLength = "hashLength" in config ? config.hashLength : 7;
  config.outputBase = "outputBase" in config ? config.outputBase : "";
  config.inputBase = "inputBase" in config ? config.inputBase : "";
  config.clean = "clean" in config ? config.clean : false;
  config = queryParam(config);
  return config;
}

function queryParam(config) {
  var output = {};
  for (var key in config.output) {
    var query = key.split("?");
    if (query.length > 1) {
      try {
        output[query[0]] = setOutput(config.output[key]);
        var param = query[1].split("&");
        param.forEach(element => {
          setParam(element, output[query[0]]);
        });
      } catch (e) {
        console.log("Error parsing query param at: " + key);
      }
    } else {
      output[key] = setOutput(config.output[key]);
    }
  }
  config.output = output;
  return config;
}

function setOutput(output) {  
  if (typeof output === 'object' && !Array.isArray(output)) {
    return output;
  } else {
    if (Array.isArray(output)) {      
      var res = {
        input: {}
      };
      output.forEach(element => {
        res.input[element] = true;
      });
      return res;
    } else {
      var res = {
        input: {}
      };
      res.input[output] = true;      
      return res;
    }
  }
}

function setParam(param, obj) {
  var split = param.split("=");
  if (split[0] && split[1]) {
    switch (split[0]) {
      case "clean":
        obj[split[0]] = split[1] === "true" ? true : false;
        break;
      case "parse":
        obj[split[0]] = split[1] === "true" ? true : false;
        break;
      default:
        obj[split[0]] = split[1];
        break;
    }
  }
}