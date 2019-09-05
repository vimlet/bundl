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

suite("bundl-input", () => {

    before(async () => {
        await rimraf(path.join(resources, "input/output"));        
        await bundl.build(require(path.join(resources, "input/bundl.config.js")));
    });

    test("input1", async () => {
        var name = "input1";
        var result = (await readFile(path.join(resources, `input/output/${name}.txt`))).toString();
        assert.notStrictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    test("input2", async () => {
        var name = "input2";
        var result = (await readFile(path.join(resources, `input/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });
    test("input3", async () => {
        var name = "input3";
        var result = (await readFile(path.join(resources, `input/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nd\nc\nd", `Output mismatch - ${name}`);
    });
    test("input4", async () => {
        var name = "input4";
        var result = (await readFile(path.join(resources, `input/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nc", `Output mismatch - ${name}`);
    });

});