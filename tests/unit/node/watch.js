const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const run = require("@vimlet/commons-run");

const bundl = require("../../../src/index.js");
const pack = require("../../../src/lib/pack.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-watch", () => {

    before(async () => {
        await rimraf(path.join(resources, "watch/output"));        
        let config = require(path.join(resources, "watch/bundl.config.js"));
        await pack.buildSingle(config, path.join(resources, "watch/input/a.txt"), null);
    });

    test("watch1", async () => {
        var name = "watch1";
        var result = (await readFile(path.join(resources, `watch/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    test("watch2", async () => {
        var name = "watch2";
        var result = (await readFile(path.join(resources, `watch/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    test("copy1", async () => {
        var name = "1";        
        var result = JSON.stringify(await readdir(path.join(resources, `copy/output/${name}`)));
        var expected = `["a.txt","b.txt","c.txt"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });
    
    test("task after", async () => {
        var name = "task/task1";
        var result = (await readFile(path.join(resources, `watch/output/${name}.txt`))).toString();
        assert.strictEqual(result, "Task1", `Output mismatch - ${name}`);
    });
    test("task order", async () => {
        var name = "task/task2";
        var result = (await readFile(path.join(resources, `watch/output/${name}.txt`))).toString();
        assert.strictEqual(result, "Task2", `Output mismatch - ${name}`);
    });
    // test("task referenced from output", async () => {
    //     var name = "task/task3";
    //     var result = (await readFile(path.join(resources, `watch/output/${name}.txt`))).toString();
    //     assert.strictEqual(result, "Task3", `Output mismatch - ${name}`);
    // });

});