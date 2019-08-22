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

suite("bundl-mixedOrder", () => {

    before(async () => {
        await rimraf(path.join(resources, "mixedOrder/output"));        
        await bundl.build(require(path.join(resources, "mixedOrder/bundl.config.js")));
    });

    test("Execution", async () => {
        var result1 = parseInt((await readFile(path.join(resources, `mixedOrder/output/mixedSort1.txt`))).toString());
        var result2 = parseInt((await readFile(path.join(resources, `mixedOrder/output/mixedSort2.txt`))).toString());
        var result3 = parseInt((await readFile(path.join(resources, `mixedOrder/output/mixedSort3.txt`))).toString());
        var result4 = parseInt((await readFile(path.join(resources, `mixedOrder/output/mixedSort4.txt`))).toString());    
        var result5 = parseInt((await readFile(path.join(resources, `mixedOrder/output/mixedSort5.txt`))).toString());       
        var result6 = parseInt((await readFile(path.join(resources, `mixedOrder/output/mixedSort6.txt`))).toString());       
        var result7 = (await readFile(path.join(resources, `mixedOrder/output/mixedSort7.txt`))).toString().split("\n");
        result7 = result7.map(current=> parseInt(current));                
        var order = (result6 <= result7[0] || result7[0] < result6) && (result7[0] < result4) && (result4 <= result5 || result5 < result4) && (result5 < result1) && (result1 < result7[1])  && (result7[1] < result2) && (result2 < result3); 
        assert.isOk(order, `mixedOrder execution order is not correct`);
    });
    test("Write", async () => {
        var result1 = (await statFile(path.join(resources, `mixedOrder/output/mixedSort1.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `mixedOrder/output/mixedSort2.txt`))).mtime;
        var result3 = (await statFile(path.join(resources, `mixedOrder/output/mixedSort3.txt`))).mtime;
        var result4 = (await statFile(path.join(resources, `mixedOrder/output/mixedSort4.txt`))).mtime;    
        var result5 = (await statFile(path.join(resources, `mixedOrder/output/mixedSort5.txt`))).mtime;    
        var result6 = (await statFile(path.join(resources, `mixedOrder/output/mixedSort6.txt`))).mtime;    
        var result7 = (await statFile(path.join(resources, `mixedOrder/output/mixedSort7.txt`))).mtime;        
        var order = (result6 < result4) && ((result4 <= result5) || (result5 < result4)) && (result5< result1) && (result1 < result2) && ((result7 < result2) ||(result2 < result7)) && (result7 <= result3);
        assert.isOk(order, `mixedOrder write order is not correct`);
    });    
});