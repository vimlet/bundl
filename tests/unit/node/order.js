const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const readFile = promisify(fs.readFile);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-order", () => {

    before(async () => {
        await rimraf(path.join(resources, "order/output"));        
        await bundl.build(require(path.join(resources, "order/bundl.config.js")));
    });

    test("order", async () => {
        var result1 = (await readFile(path.join(resources, `order/output/sort1.txt`))).toString();
        var result2 = (await readFile(path.join(resources, `order/output/sort2.txt`))).toString();
        var result3 = (await readFile(path.join(resources, `order/output/sort3.txt`))).toString();
        var result4 = (await readFile(path.join(resources, `order/output/sort4.txt`))).toString();        
        var order = (parseInt(result4) < parseInt(result1)) && (parseInt(result1) < parseInt(result2)) && (parseInt(result2) < parseInt(result3));
        assert.isOk(order, `order order is not correct`);
    });

    
});