const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const statFile = promisify(fs.stat);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-before", () => {

    before(async () => {
        await rimraf(path.join(resources, "before/output"));        
        await bundl.build(require(path.join(resources, "before/bundl.config.js")));
    });

    test("before", async () => {
        var result1 = (await statFile(path.join(resources, `before/output/before1.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `before/output/before2.txt`))).mtime;
        var result3 = (await statFile(path.join(resources, `before/output/before3.txt`))).mtime;
        var result4 = (await statFile(path.join(resources, `before/output/before4.txt`))).mtime;        
        var order = ((result4) < (result1)) && ((result1) < (result2)) && ((result2) <= (result3));
        assert.isOk(order, `Before order is not correct`);
    });

    
});