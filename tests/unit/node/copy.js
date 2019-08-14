const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const readFile = promisify(fs.readFile);
const glob = require("@vimlet/commons-glob");
const readdir = promisify(fs.readdir);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-copy", () => {

    before(async () => {
        await rimraf(path.join(resources, "copy/output"));        
        await bundl.build(require(path.join(resources, "copy/bundl.config.js")));
    });

    test("copy1", async () => {
        var name = "1";        
        var result = JSON.stringify(await readdir(path.join(resources, `copy/output/${name}`)));
        var expected = `["a.txt","b.txt","c.txt"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("copy2", async () => {
        var name = "2";
        var result = JSON.stringify(await readdir(path.join(resources, `copy/output/${name}`)));
        var expected = `["a.txt","b.txt","c.txt"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("copy3", async () => {
        var name = "3";
        var result = JSON.stringify(await readdir(path.join(resources, `copy/output/${name}`)));
        var expected = `["a.txt","b.txt","c.txt"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });
    
    test("copy4", async () => {
        var name = "4";
        var result = JSON.stringify(await readdir(path.join(resources, `copy/output/${name}`)));
        var expected = `["a.txt","b.txt","c.txt"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

    test("copy5", async () => {
        var name = "5";
        var result = JSON.stringify(await readdir(path.join(resources, `copy/output/${name}`)));
        var expected = `["a.txt","b.txt","c.txt"]`;                
        assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    });

});