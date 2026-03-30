#!/usr/bin/env node

require("./lib/logs")

// Lib mode
module.exports.build = require("./lib/pack").build;
module.exports.runTask = require("./lib/pack").runTask;

// Cli mode
if (!module.parent) {
  require("./lib/cli")();
} 

// Exec
module.exports.run = require("@vimlet/commons-run");