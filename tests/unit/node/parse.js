const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const readFile = promisify(fs.readFile);

const bundl = require("../../../src/index.js");
const resources = path.join(__dirname, "../../resources");

function cleanResult(result) {
  return result.replace(/[\n\r]/g, "");
}

suite("bundl-parse", () => {

  before(async () => {
    await rimraf(path.join(resources, "join/output"));
    await bundl.build(require(path.join(resources, "parse/bundl.config.js")));
  });

  test("parse1", async () => {
    var name = "parse1";
    var result = cleanResult((await readFile(path.join(resources, `parse/output/${name}.txt`))).toString());
    assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
  });
});