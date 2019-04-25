#!/usr/bin/env node

var meta = require("@vimlet/meta");
var path = require("path");
var fs = require("fs");
var pack = require("./lib/pack");

var configPath = path.join(process.cwd(), "metapack.js");

if (fs.existsSync(configPath)) {
  var config = require(configPath);
} else {
  console.log("Config file metapack.js not found, please create one!");
  process.exit(1);
}

// Metapack prototyping!
pack.build(config);

// Command mode
if (!module.parent) {
  require("./lib/cli")();
}