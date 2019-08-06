#!/usr/bin/env node

// Lib mode
module.exports.build = require("./lib/pack").build;

// Cli mode
if (!module.parent) {
  require("./lib/cli")();
} 

// Exec
module.exports.run = require("@vimlet/commons-run");