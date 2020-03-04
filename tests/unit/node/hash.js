const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const readFile = promisify(fs.readFile);
const statFile = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-hash", () => {

    before(async () => {
        await rimraf(path.join(resources, "hash/output"));        
        await bundl.build(require(path.join(resources, "hash/bundl.config.js")));
    });

    test("pack", async () => {
        var name = "1";
        var files = await readdir(path.join(resources, `hash/output/${name}`));        
        var result = (await readFile(path.join(resources,`hash/output/${name}`, files[0]))).toString();
        assert.strictEqual(result, "a\nb\nc\nd", `Hash output mismatch - ${name}`);
    });
    test("hash name", async () => {
        var name = "2";
        var files = await readdir(path.join(resources, `hash/output/${name}`));        
        var result = (await readFile(path.join(resources,`hash/output/${name}`, files[0]))).toString();
        
        var filesExpected = await readdir(path.join(resources, `hash/output/1`));        
        var expected = filesExpected[0].split(".")[1];
        assert.strictEqual(result, expected, `Hash output mismatch - ${name}`);
    });
    
});