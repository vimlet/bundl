const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const statFile = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const run = require("@vimlet/commons-run");
const readdir = promisify(fs.readdir);

const resources = path.join(__dirname, "../../resources");

suite("bundl-command", () => {

    before(async () => {
        await rimraf(path.join(resources, "command/output"));
        await run.exec('node', {
            args: ["src/index.js", "-c", "tests/resources/command/bundl.config.js"]
        });
    });
    
    test("join", async () => {
        var name = "join";
        var result = (await readFile(path.join(resources, `command/output/${name}.txt`))).toString();
        assert.strictEqual(result, "a\nb\nc", `Command join mismatch - ${name}`);
    });
    
    test("copy", async () => {
        var name = "copy";
        var result = JSON.stringify(await readdir(path.join(resources, `command/output/${name}`)));        
        var expected = `["a.txt","b.txt","c.txt"]`;                
        assert.strictEqual(result, expected, `Command copy mismatch - ${name}`);
    });
    
    test("sort", async () => {
        var result1 = (await statFile(path.join(resources, `command/output/sort1.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `command/output/sort2.txt`))).mtime;
        var result3 = (await statFile(path.join(resources, `command/output/sort3.txt`))).mtime;
        var result4 = (await statFile(path.join(resources, `command/output/sort4.txt`))).mtime;
        var order = ((result4) < (result1)) && ((result1) < (result2)) && ((result2) < (result3));
        assert.isOk(order, `Command sort order is not correct`);
    });
    
});