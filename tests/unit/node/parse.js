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
const readFile = promisify(fs.readFile);
const statFile = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-parse", () => {

    before(async () => {
        await rimraf(path.join(resources, "parse/output"));
        await bundl.build(require(path.join(resources, "parse/bundl.config.js")));
    });

    test("parse", async () => {
        var name = "1";
        var files = await readdir(path.join(resources, `parse/output/${name}`));
        var result = (await readFile(path.join(resources, `parse/output/${name}`, files[0]))).toString();
        assert.strictEqual(result, "a\nb\nc\nd", `parse output mismatch - ${name}`);
    });

    test("meta", async () => {
        var name = "3/meta.txt";
        var result = (await readFile(path.join(resources, `parse/output/${name}`))).toString();
        assert.strictEqual(result, "Hi I'm another template.", `meta output mismatch - ${name}`);
    });

    test("hash", async () => {
        var name = "4/index.html";
        var result = (await readFile(path.join(resources, `parse/output/${name}`))).toString();
        var files = await readdir(path.join(resources, `parse/output/1`));
        var exists = result.indexOf(files[0]) > -1;
        assert.isOk(exists, "Parse hash is not importing src correctly");
    });

    test("copy hash", async () => {
        var name = "5/meta.txt";
        var result = (await readFile(path.join(resources, `parse/output/${name}`))).toString();
        assert.strictEqual(result, "Hi I'm another template.", `copy hash output mismatch - ${name}`);
    });

    test("file", async () => {
        var name = "6/file.html";
        var result = (await readFile(path.join(resources, `parse/output/${name}`))).toString();
        var files = await readdir(path.join(resources, `parse/output/1`));        
        var exists = result.indexOf(path.join("output/1",files[0]).replace(new RegExp(/\\/,"gm"),"/")) > -1;
        assert.isOk(exists, "Parse file is not importing src correctly");
    });
    
    test("fileName", async () => {
        var name = "7/filename.html";
        var result = (await readFile(path.join(resources, `parse/output/${name}`))).toString();
        var files = await readdir(path.join(resources, `parse/output/1`));
        var exists = result.indexOf(files[0]) > -1;
        assert.isOk(exists, "Parse filename is not importing src correctly");
    });


});