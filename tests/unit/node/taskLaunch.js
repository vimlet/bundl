const {
    suite,
    test,
    before
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");
const {
    promisify
} = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const access = promisify(fs.access);
const statFile = promisify(fs.stat);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-taskLaunch", () => {

    before(async () => {
        await rimraf(path.join(resources, "taskLaunch/output"));
        await bundl.build(require(path.join(resources, "taskLaunch/bundl.config.js")));
    });
    
    test("join1", async () => {
        var name = "join1";
        var result = (await readFile(path.join(resources, `taskLaunch/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });
    test("taskLaunch1", async () => {
        var name = "taskLaunch1";
        var result = (await readFile(path.join(resources, `taskLaunch/output/${name}.txt`))).toString();
        assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
    });
    test("taskLaunch2", async () => {
        var name = "taskLaunch2";
        var result = (await readFile(path.join(resources, `taskLaunch/output/${name}.txt`))).toString();
        assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
    });


});