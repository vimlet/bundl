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
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const run = require("@vimlet/commons-run");
const statFile = promisify(fs.stat);

const bundl = require("../../../src/index.js");
const pack = require("../../../src/lib/pack.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-watchSortedSorted", () => {

    before(async () => {
        await rimraf(path.join(resources, "watchSortedSorted/output"));
        await writeFile(path.join(resources, `watchSortedSorted/input/parse/1.vmt`), "I'm 1 <% template('2.vmi');%>");
        await writeFile(path.join(resources, `watchSortedSorted/input/parseCopy/1.vmt`), "I'm 1 <% template('2.vmi');%>");
        await writeFile(path.join(resources, `watchSortedSorted/input/copy/test1.txt`), "test1");
        bundl.run.exec('node', {
            args: ["src/index.js", "-c", "tests/resources/watchSortedSorted/bundl.config.js"]
        });
        await waitTest(2);
    });


    // // Modify file from parse folder and check the modification at the output
    // test("watchSortedSorted parse", async () => {
    //     var name = "parse/1.txt";
    //     var result = (await readFile(path.join(resources, `watchSortedSorted/output/${name}`))).toString();
    //     assert.strictEqual(result, "I'm 1 I'm 2", `Output mismatch - ${name}`);
    //     await writeFile(path.join(resources, `watchSortedSorted/input/parse/1.vmt`), "Test");
    //     await waitTest(1);
    //     var result2 = (await readFile(path.join(resources, `watchSortedSorted/output/${name}`))).toString();
    //     assert.strictEqual(result2, "Test", `Output mismatch - ${name}`);
    // });

    // // Modify file from copy folder and check the modification at the output
    // test("watchSortedSorted copy", async () => {
    //     var name = "copy/test1.txt";
    //     var result = JSON.stringify(await readdir(path.join(resources, `watchSortedSorted/output/copy`)));
    //     var expected = JSON.stringify(await readdir(path.join(resources, `watchSortedSorted/input/copy`)));
    //     assert.strictEqual(result, expected, `Output mismatch - ${name}`);
    //     var result1 = (await readFile(path.join(resources, `watchSortedSorted/output/${name}`))).toString();
    //     assert.strictEqual(result1, "test1", `Output mismatch - ${name}`);
    //     await writeFile(path.join(resources, `watchSortedSorted/input/copy/test1.txt`), "Test");
    //     await waitTest(1);
    //     var result2 = (await readFile(path.join(resources, `watchSortedSorted/output/${name}`))).toString();
    //     assert.strictEqual(result2, "Test", `Output mismatch - ${name}`);
    // });

    // Modify file from parse which run before task1 and and check the modification at the output task
    test("watchSortedSorted task1 after parse copy", async () => {
        var name = "parseCopy/1.vmt";
        await waitTest(1);
        var result = (await readFile(path.join(resources, `watchSortedSorted/output/task/task1.txt`))).toString();
        assert.strictEqual(result, "Task1", `Output mismatch`);
        await waitTest(1);
        await rimraf(path.join(resources, `watchSortedSorted/output/task/task1.txt`));
        await rimraf(path.join(resources, `watchSortedSorted/output/task/task2.txt`));
        console.log("TASKS DELETED");
        
        await waitTest(2);
        await writeFile(path.join(resources, `watchSortedSorted/input/parse/1.vmt`), "Test2");
        await writeFile(path.join(resources, `watchSortedSorted/input/parseCopy/1.vmt`), "Test2");
        await waitTest(1);
        var exists = true;
        try {
            await statFile(path.join(resources, `watchSortedSorted/output/task/task1.txt`));
            await statFile(path.join(resources, `watchSortedSorted/output/task/task2.txt`));
        } catch (error) {
            exists = false;
        }
        assert.isOk(exists, "Task1 after parse copy should exist");
    });
});



function waitTest(amount) {
    return new Promise((resolve, reject) => {
        amount = amount || 1;
        setTimeout(() => {
            resolve("Waited for");
        }, (500 * amount));
    });
}