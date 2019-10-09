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

suite("bundl-taskCompleteWatch", () => {

    before(async () => {
        await rimraf(path.join(resources, "taskCompleteWatch/output"));
        // await bundl.build(require(path.join(resources, "taskCompleteWatch/bundl.config.js")));
        bundl.run.exec('node', {
            args: ["src/index.js", "-c", "tests/resources/taskCompleteWatch/bundl.config.js"]
        });
        // await waitTest(2);
    });
    
    test("join1", async () => {
        var name = "join1";
        var result = (await readFile(path.join(resources, `join/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    // test("task1", async () => {
    //     var name = "task1";
    //     var result = (await readFile(path.join(resources, `taskCompleteWatch/output/${name}.txt`))).toString();
    //     assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
    // });

});
function waitTest(amount) {
    return new Promise((resolve, reject) => {
        amount = amount || 1;
        setTimeout(() => {
            resolve("Waited for");
        }, (500 * amount));
    });
}