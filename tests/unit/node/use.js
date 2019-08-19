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

suite("bundl-use", () => {

    before(async () => {
        await rimraf(path.join(resources, "use/output"));        
        await bundl.build(require(path.join(resources, "use/bundl.config.js")));
    });

    test("use1", async () => {
        var name = "use1";
        var result = (await readFile(path.join(resources, `use/output/${name}.txt`))).toString();
        var expected = "First function";
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("use2", async () => {
        var name = "use2";
        var expected = "First functionSecond function";
        var result = (await readFile(path.join(resources, `use/output/${name}.txt`))).toString();
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("use3", async () => {
        var name = "use3";
        var result = (await readFile(path.join(resources, `use/output/${name}.txt`))).toString();
        var expected = "First function\nFirst function\nFirst function";
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });
    
    test("use4", async () => {
        var name = "use4";
        var expected = "First functionSecond function\nFirst functionSecond function\nFirst functionSecond function";
        var result = (await readFile(path.join(resources, `use/output/${name}.txt`))).toString();
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("use5", async () => {
        var name = "5";
        var result = (await readFile(path.join(resources, `use/output/${name}/a.txt`))).toString();
        var expected = "First function";
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("use6", async () => {
        var name = "6";
        var result = (await readFile(path.join(resources, `use/output/${name}/a.txt`))).toString();
        var expected = "First functionSecond function";
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("use7", async () => {
        var name = "7";
        var result = (await readFile(path.join(resources, `use/output/${name}/a.txt`))).toString();
        var expected = "First function";
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("use8", async () => {
        var name = "8";
        var result = (await readFile(path.join(resources, `use/output/${name}/a.txt`))).toString();
        var expected = "First functionSecond function";
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });
});