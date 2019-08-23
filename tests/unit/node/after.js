const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const readFile = promisify(fs.readFile);
const statFile = promisify(fs.stat);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-after", () => {

    before(async () => {
        await rimraf(path.join(resources, "after/output"));        
        await bundl.build(require(path.join(resources, "after/bundl.config.js")));
    });

    test("after", async () => {
        var result1 = parseInt((await readFile(path.join(resources, `after/output/after1.txt`))).toString());
        var result2 = parseInt((await readFile(path.join(resources, `after/output/after2.txt`))).toString());
        var result3 = parseInt((await readFile(path.join(resources, `after/output/after3.txt`))).toString());
        var result4 = parseInt((await readFile(path.join(resources, `after/output/after4.txt`))).toString());   
        var result5 = parseInt((await readFile(path.join(resources, `after/output/after5.txt`))).toString());
        var result6 = parseInt((await readFile(path.join(resources, `after/output/after6.txt`))).toString());     
        var order = result4 < result1 && result1 < result5 && result5 < result6 && result6 < result2 && result2 < result3;
        assert.isOk(order, `after order is not correct`);
    });

    
});