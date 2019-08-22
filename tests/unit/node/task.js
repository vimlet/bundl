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

suite("bundl-task", () => {

    before(async () => {
        await rimraf(path.join(resources, "task/output"));        
        await bundl.build(require(path.join(resources, "task/bundl.config.js")));
    });

    test("task1", async () => {
        var name = "task1";
        var result = (await readFile(path.join(resources, `task/output/${name}.txt`))).toString();
        assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
    });


});