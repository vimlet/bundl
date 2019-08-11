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

suite("bundl-join", () => {

  before(async () => {
    await rimraf(path.join(resources, "join/output"));
    await bundl.build(require(path.join(resources, "join/bundl.config.js")));
  });

  test("join1", async () => {
    var name = "join1";
    var result = cleanResult((await readFile(path.join(resources, `join/output/${name}.txt`))).toString());
    assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
  });

  test("join2", async () => {
    var name = "join2";
    var result = cleanResult((await readFile(path.join(resources, `join/output/${name}.txt`))).toString());
    assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
  });

  test("join3", async () => {
    var name = "join3";
    var result = cleanResult((await readFile(path.join(resources, `join/output/${name}.txt`))).toString());
    assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
  });

  test("join4", async () => {
    var name = "join4";
    var result = cleanResult((await readFile(path.join(resources, `join/output/${name}.txt`))).toString());
    assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
  });

  test("join5", async () => {
    var name = "join5";
    var result = cleanResult((await readFile(path.join(resources, `join/output/${name}.txt`))).toString());
    assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
  });

});