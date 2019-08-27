const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const statFile = promisify(fs.stat);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-taskOrder", () => {

    before(async () => {
        await rimraf(path.join(resources, "taskOrder/output"));        
        await bundl.build(require(path.join(resources, "taskOrder/bundl.config.js")));
    });

    
    test("taskOrder1", async () => {
        var name = "task1";
        var result = (await readFile(path.join(resources, `taskOrder/output/${name}.txt`))).toString();
        assert.strictEqual(result, "abc", `Output mismatch - ${name}`);
    });
    
    test("order", async () => {
        var result1 = (await statFile(path.join(resources, `taskOrder/output/task1.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `taskOrder/output/taskOrder2.txt`))).mtime;       
        var order = result1 < result2;
        console.log("result1",result1);
        console.log("result2",result2);
        console.log("result1 < result2",result1 < result2);
        
        assert.isOk(order, `order is not correct`);
    });

});