const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const statFile = promisify(fs.stat);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-after", () => {

    before(async () => {
        await rimraf(path.join(resources, "after/output"));        
        await bundl.build(require(path.join(resources, "after/bundl.config.js")));
    });

    test("after", async () => {
        var result1 = (await statFile(path.join(resources, `after/output/after1.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `after/output/after2.txt`))).mtime;
        var result3 = (await statFile(path.join(resources, `after/output/after3.txt`))).mtime;
        var result4 = (await statFile(path.join(resources, `after/output/after4.txt`))).mtime;
        
        var order = ((result3) < (result2)) && ((result2) < (result4)) && ((result4) <= (result1));
        assert.isOk(order, `After order is not correct`);
    });

    
});