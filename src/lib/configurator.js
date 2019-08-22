
// @function setupOutput (public) [Set up configuration for output entry]
module.exports.setupOutput = function(config){
  config.hashLength = "hashLength" in config ? config.hashLength : 7;
  config.outputBase = "outputBase" in config ? config.outputBase : "";
  config.inputBase = "inputBase" in config ? config.inputBase : "";
  config.clean = "clean" in config ? config.clean : false;
  config = queryParam(config);
  return config;
};

// @function queryParam (private) [Manage query param in outputs]
function queryParam(config) {
  if ("output" in config && typeof config.output != 'object') {
    throw new Error("Bundl.config is bad formatted");
  }
  var output = {};
  for (var key in config.output) {
    var query = key.split("?");
    if (query.length > 1) {
      try {
        output[query[0]] = setOutput(config.output[key], key);
        var param = query[1].split("&");
        param.forEach(element => {
          setParam(element, output[query[0]]);
        });
      } catch (e) {
        console.log("Error parsing query param at: " + key);
      }
    } else {
      output[key] = setOutput(config.output[key], key);
    }
  }
  config.output = output;
  return config;
}


// @function setOutput (private) [Set output config from inputs. Handle array, string and object] @param output [Object] @param key [Output key]
function setOutput(output, key) {
  if (typeof output === 'object' && !Array.isArray(output)) {
    return setOutputObject(output);
  } else {
    if (Array.isArray(output)) {
      return setOutputArray(output);
    } else {
      return setOutputString(output);
    }
  }
}

// @function setOutputString (private) [Set output config where output is a string] @param output [Object]
function setOutputString(output) {
  var res = {
    input: {}
  };
  res.input[output] = true;
  return res;
}

// @function setOutputArray (private) [Set output config where output is an array] @param output [Object]
function setOutputArray(output) {
  output = output.map(current => {
    if (typeof current === 'object') {
      return setOutputObject(current);
    } else {
      return setOutputString(current);
    }
  });
  return output;
}

// @function setOutputObject (private) [Set output config where output is an object] @param output [Object]
function setOutputObject(output) {
  if (typeof output.input === 'object' && !Array.isArray(output.input)) {
    return setInputObject(output);
  } else {
    if (Array.isArray(output.input)) {
      return setInputArray(output);
    } else {
      return setInputString(output);
    }
  }
}

// @function setInputObject (private) [Set input where input is an object]
function setInputObject(output) {
  return output;
}
// @function setInputArray (private) [Set input where input is an array]
function setInputArray(output) {
  var inp = {};
  output.input.forEach(cuInp => {
    if (typeof cuInp != 'object') {
      inp[cuInp] = true;
    } else {
      for (var cuKey in cuInp) {
        inp[cuKey] = cuInp[cuKey];
      }
    }
  });
  output.input = inp;
  return output;
}
// @function setInputString (private) [Set input where input is a string]
function setInputString(output) {
  var inp = {};
  inp[output.input] = true;
  output.input = inp;
  return output;
}

// @function setParam (private) [Set up query params into element config] @param param @param obj [Output object]
function setParam(param, obj) {
  var split = param.split("=");
  if (split[0] && split[1]) {
    switch (split[0]) {
      case "parse":
        var value = split[1] === "true" ? true : false;
        setParamKey(obj, split[0], value);
        break;
      default:
        setParamKey(obj, split[0], split[1]);
        break;
    }
  }
}

// @function setParamKey (private) [Set up single param into element config] @param obj [Output object] @param key [Param key] @param value
function setParamKey(obj, key, value) {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    if (!(key in obj)) {
      obj[key] = value;
    }
  } else if (Array.isArray(obj)) {
    obj = obj.map(element => {
      if (typeof element === 'object') {
        if (!(key in element)) {
          element[key] = value;
        }
      }
      return element;
    });
  }
}