const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const statFile = promisify(fs.stat);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-copy-before", () => {

    before(async () => {
        await rimraf(path.join(resources, "copyBefore/output"));        
        await bundl.build(require(path.join(resources, "copyBefore/bundl.config.js")));
    });

    test("copyBefore", async () => {
        var result1 = (await statFile(path.join(resources, `copyBefore/output/1/a.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `copyBefore/output/2/a.txt`))).mtime;
        var result3 = (await statFile(path.join(resources, `copyBefore/output/3/a.txt`))).mtime;     
        var order = ((result1) < (result3)) && ((result3) < (result2));
        assert.isOk(order, `Copy-before order is not correct`);
    });


});