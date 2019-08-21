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

suite("bundl-join-order", () => {

    before(async () => {
        await rimraf(path.join(resources, "joinOrder/output"));        
        await bundl.build(require(path.join(resources, "joinOrder/bundl.config.js")));
    });

    test("join1", async () => {
        var name = "join1";
        var result = (await readFile(path.join(resources, `joinOrder/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    test("join2", async () => {
        var name = "join2";
        var result = (await readFile(path.join(resources, `joinOrder/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    test("join3", async () => {
        var name = "join3";
        var result = (await readFile(path.join(resources, `joinOrder/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });
    
    test("join4", async () => {
        var name = "join4";
        var result = (await readFile(path.join(resources, `joinOrder/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    test("join5", async () => {
        var name = "join5";
        var result = (await readFile(path.join(resources, `joinOrder/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

});