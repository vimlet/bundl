const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const readFile = promisify(fs.readFile);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-sort", () => {

    before(async () => {
        await rimraf(path.join(resources, "sort/output"));        
        await bundl.build(require(path.join(resources, "sort/bundl.config.js")));
    });

    test("sort", async () => {
        var result1 = (await readFile(path.join(resources, `sort/output/sort1.txt`))).toString();
        var result2 = (await readFile(path.join(resources, `sort/output/sort2.txt`))).toString();
        var result3 = (await readFile(path.join(resources, `sort/output/sort3.txt`))).toString();
        var result4 = (await readFile(path.join(resources, `sort/output/sort4.txt`))).toString();        
        var order = (parseInt(result4) < parseInt(result1)) && (parseInt(result1) < parseInt(result2)) && (parseInt(result2) < parseInt(result3));
        assert.isOk(order, `Sort order is not correct`);
    });

    
});