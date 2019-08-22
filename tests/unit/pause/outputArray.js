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
const statFile = promisify(fs.stat);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-outputArray", () => {

    before(async () => {
        await rimraf(path.join(resources, "outputArray/output"));        
        await bundl.build(require(path.join(resources, "outputArray/bundl.config.js")));
    });

    test("copy", async () => {
        var name = "copy";        
        var result = JSON.stringify(await readdir(path.join(resources, `outputArray/output/${name}`)));
        var expected = `["a.txt","b.txt","c.txt"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    
    test("copy order", async () => {
        var result1 = (await statFile(path.join(resources, `outputArray/output/copyOrder/a.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `outputArray/output/copyOrder/b.txt`))).mtime;
        var result3 = (await statFile(path.join(resources, `outputArray/output/copyOrder/c.txt`))).mtime;
        var order = ((result1) < (result3)) && ((result3) < (result2));
        assert.isOk(order, `Copy order is not correct`);
    });

    test("transform", async () => {
        var name = "join";        
        var result = (await readFile(path.join(resources, `outputArray/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });

    test("transform order", async () => {
        var name = "joinOrder";        
        var result = (await readFile(path.join(resources, `outputArray/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Output mismatch - ${name}`);
    });


});