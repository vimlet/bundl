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

suite("bundl-task", () => {

    before(async () => {
        await rimraf(path.join(resources, "task/output"));
        await bundl.build(require(path.join(resources, "task/bundl.config.js")));
    });
    
    test("join1", async () => {
        var name = "join1";
        var result = (await readFile(path.join(resources, `join/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    test("task1", async () => {
        var name = "task1";
        var result = (await readFile(path.join(resources, `task/output/${name}.txt`))).toString();
        assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
    });

    test("task2", async () => {
        var name = "task2";
        var result;
        try {
            result = await access(path.join(resources, `task/output/${name}.txt`), fs.constants.F_OK);
        } catch (e) {
            result = e;
        }
        assert.isOk(result, "abc", `File shouldn't be written - ${name}`);
    });

    test("order", async () => {
        var result3 = (await statFile(path.join(resources, `task/output/task3.txt`))).mtime;
        var result4 = (await statFile(path.join(resources, `task/output/task4.txt`))).mtime;
        var result5 = (await statFile(path.join(resources, `task/output/task5.txt`))).mtime;
        var result6 = (await statFile(path.join(resources, `task/output/task6.txt`))).mtime;
        // Sequential order and parallel order
        var order = Math.abs(result4-result3) > 1000 && Math.abs(result6-result5) < 1000;
        assert.isOk(order, `task order is not correct`);
    });

    test("order runs & runp together in a task", async () => {
        var result9 = (await statFile(path.join(resources, `task/output/task9.txt`))).mtime;
        var result10 = (await statFile(path.join(resources, `task/output/task10.txt`))).mtime;
        var result11 = (await statFile(path.join(resources, `task/output/task11.txt`))).mtime;
        var result12 = (await statFile(path.join(resources, `task/output/task12.txt`))).mtime;          
        // Sequential order, parallel order and first sequential and first parallel launch at the same time
        var order = Math.abs(result10-result9) > 1000 && Math.abs(result12-result11) < 1000 && Math.abs(result11-result9) < 1000;
        assert.isOk(order, `task order is not correct`);
    });


});