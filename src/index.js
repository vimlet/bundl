#!/usr/bin/env node

var meta = require("@vimlet/meta");
var path = require("path");
var fs = require("fs");

var configPath = path.join(process.cwd(), "metapack.js");

if (fs.existsSync(configPath)) {
  var config = require(configPath);
} else {
  console.log("Config file metapack.js not found, please create one!");
  process.exit(1);
}

// Metapack prototyping!
for (var output in config.output) {
  var outputEntry = config.output[output];
  var outputParent = path.dirname(output);
  var file = "";
  for (var input in outputEntry.input) {
    var inputEntry = outputEntry.input[input];
    file += fs.readFileSync(input).toString() + "\n";
  }
  if (!fs.existsSync(outputParent)) {
    fs.mkdirSync(outputParent);
  }
  fs.writeFileSync(output, file);
}

// Command mode
if (!module.parent) {
  require("./lib/cli")();
}