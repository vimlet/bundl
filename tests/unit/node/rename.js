const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const statFile = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-rename", () => {

    before(async () => {
        await rimraf(path.join(resources, "rename/output"));
        await bundl.build(require(path.join(resources, "rename/bundl.config.js")));
    });
    
    test("Output use single", async () => {
        var name = "1";        
        var result = JSON.stringify(await readdir(path.join(resources, `rename/output/${name}`)));
        var expected = `["a.html","b.html","c.html","d.html"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });
    test("Output use multiple", async () => {
        var name = "2";        
        var result = JSON.stringify(await readdir(path.join(resources, `rename/output/${name}`)));
        var expected = `["a.js","b.js","c.js","d.js"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });
    test("Input use single", async () => {
        var name = "3";        
        var result = JSON.stringify(await readdir(path.join(resources, `rename/output/${name}`)));
        var expected = `["a.html","b.html","c.html","d.html"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });
    test("Input use multiple", async () => {
        var name = "4";        
        var result = JSON.stringify(await readdir(path.join(resources, `rename/output/${name}`)));
        var expected = `["a.js","b.js","c.js","d.js"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });
    
    
});