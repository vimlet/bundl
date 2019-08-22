const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-run", () => {

    before(async () => {
        await rimraf(path.join(resources, "run/output"));        
        await bundl.runTask(require(path.join(resources, "run/bundl.config.js")), ["run1","run2"]);
    });

    test("run1", async () => {
        var name = "run1";
        var result = (await readFile(path.join(resources, `run/output/${name}.txt`))).toString();
        assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
    });
    test("run2", async () => {
        var name = "run2";
        var result = (await readFile(path.join(resources, `run/output/${name}.txt`))).toString();
        assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
    });


});