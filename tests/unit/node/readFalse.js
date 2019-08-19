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

suite("bundl-readFalse", () => {

    before(async () => {
        await rimraf(path.join(resources, "readFalse/output"));
        await bundl.build(require(path.join(resources, "readFalse/bundl.config.js")));
    });
    
    test("transform", async () => {
        var name = "transform";        
        var result = (await readFile(path.join(resources, `readFalse/output/${name}.txt`))).toString();        
        assert.strictEqual(result, "", `Read false transform mismatch - ${name}`);
    });

    test("copy", async () => {
        var name = "copy/a";        
        var result = (await readFile(path.join(resources, `readFalse/output/${name}.txt`))).toString();        
        assert.strictEqual(result, "", `Read false copy mismatch - ${name}`);
    });
    
    
});