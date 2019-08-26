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

suite("bundl-order", () => {

    before(async () => {
        await rimraf(path.join(resources, "order/output"));        
        await bundl.build(require(path.join(resources, "order/bundl.config.js")));
    });

    test("order", async () => {
        var result1 = (await statFile(path.join(resources, `order/output/order1.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `order/output/order2.txt`))).mtime;
        var result3 = (await statFile(path.join(resources, `order/output/order3.txt`))).mtime;
        var result4 = (await statFile(path.join(resources, `order/output/order4.txt`))).mtime;   
        var order = result4 < result1 && result1 < result2 && result2 < result3;
        assert.isOk(order, `order order is not correct`);
    });

    
});