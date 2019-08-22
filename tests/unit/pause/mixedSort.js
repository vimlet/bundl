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

suite("bundl-mixedSort", () => {

    before(async () => {
        await rimraf(path.join(resources, "mixedSort/output"));        
        await bundl.build(require(path.join(resources, "mixedSort/bundl.config.js")));
    });

    test("Execution", async () => {
        var result1 = parseInt((await readFile(path.join(resources, `mixedSort/output/mixedSort1.txt`))).toString());
        var result2 = parseInt((await readFile(path.join(resources, `mixedSort/output/mixedSort2.txt`))).toString());
        var result3 = parseInt((await readFile(path.join(resources, `mixedSort/output/mixedSort3.txt`))).toString());
        var result4 = parseInt((await readFile(path.join(resources, `mixedSort/output/mixedSort4.txt`))).toString());    
        var result5 = parseInt((await readFile(path.join(resources, `mixedSort/output/mixedSort5.txt`))).toString());       
        var result6 = parseInt((await readFile(path.join(resources, `mixedSort/output/mixedSort6.txt`))).toString());       
        var result7 = (await readFile(path.join(resources, `mixedSort/output/mixedSort7.txt`))).toString().split("\n");
        result7 = result7.map(current=> parseInt(current));                
        var order = (result6 <= result7[0] || result7[0] < result6) && (result7[0] < result4) && (result4 <= result5 || result5 < result4) && (result5 < result1) && (result1 < result7[1])  && (result7[1] < result2) && (result2 < result3); 
        assert.isOk(order, `mixedSort execution order is not correct`);
    });
    test("Write", async () => {
        var result1 = (await statFile(path.join(resources, `mixedSort/output/mixedSort1.txt`))).mtime;
        var result2 = (await statFile(path.join(resources, `mixedSort/output/mixedSort2.txt`))).mtime;
        var result3 = (await statFile(path.join(resources, `mixedSort/output/mixedSort3.txt`))).mtime;
        var result4 = (await statFile(path.join(resources, `mixedSort/output/mixedSort4.txt`))).mtime;    
        var result5 = (await statFile(path.join(resources, `mixedSort/output/mixedSort5.txt`))).mtime;    
        var result6 = (await statFile(path.join(resources, `mixedSort/output/mixedSort6.txt`))).mtime;    
        var result7 = (await statFile(path.join(resources, `mixedSort/output/mixedSort7.txt`))).mtime;        
        var order = (result6 < result4) && ((result4 <= result5) || (result5 < result4)) && (result5< result1) && (result1 < result2) && ((result7 < result2) ||(result2 < result7)) && (result7 <= result3);
        assert.isOk(order, `mixedSort write order is not correct`);
    });
    test("Before execution", async () => { 
        var result8 = parseInt((await readFile(path.join(resources, `mixedSort/output/mixedSort8.txt`))).toString()); 
        var result9 = parseInt((await readFile(path.join(resources, `mixedSort/output/mixedSort9.txt`))).toString());         
        var result10 = (await readFile(path.join(resources, `mixedSort/output/mixedSort10.txt`))).toString().split("\n");
        result10 = result10.map(current=> parseInt(current));  
        var order = (result10[1] < result10[0]) && (result10[0] < result8) && (result8 < result9);
        assert.isOk(order, `mixedSort before execution order is not correct`);
    });

    // TODO transformArray are always written at last.
    // test("Before write", async () => { 
    //     var result8 = (await statFile(path.join(resources, `mixedSort/output/mixedSort8.txt`))).mtime;  
    //     var result9 = (await statFile(path.join(resources, `mixedSort/output/mixedSort9.txt`))).mtime;       
    //     var result10 = (await readFile(path.join(resources, `mixedSort/output/mixedSort10.txt`))).mtime;
    //     var order = (result10 < result8) && (result8 < result9) && (result9 < result10);
    //     console.log("1:::", (result10 < result8));
    //     console.log("2:::", (result8 < result9));
    //     console.log("3:::", (result9 < result10));
    //     assert.isOk(order, `mixedSort before write order is not correct`);
    // });  

    
});