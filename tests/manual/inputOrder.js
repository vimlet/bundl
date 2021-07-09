
const path = require("path");
const bundl = require("../../src/index.js");
const resources = path.join(__dirname, "./resources");

async function exec() {
  await bundl.build(require(path.join(resources, "input.config.js")));
}


exec();