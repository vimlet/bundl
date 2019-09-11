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

suite("bundl-watchSortedSortedByBeforeAfter", () => {

    before(async () => {
        await rimraf(path.join(resources, "watchSortedSortedByBeforeAfter/output"));
        await writeFile(path.join(resources, `watchSortedSortedByBeforeAfter/input/parse/1.vmt`), "I'm 1 <% template('2.vmi');%>");
        await writeFile(path.join(resources, `watchSortedSortedByBeforeAfter/input/parseCopy/1.vmt`), "I'm 1 <% template('2.vmi');%>");
        await writeFile(path.join(resources, `watchSortedSortedByBeforeAfter/input/copy/test1.txt`), "test1");
        bundl.run.exec('node', {
            args: ["src/index.js", "-c", "tests/resources/watchSortedSortedByBeforeAfter/bundl.config.js"]
        });
        await waitTest(2);
    });



    // Modify file from parse which run before task1 and and check the modification at the output task
    test("watchSortedSortedByBeforeAfter task1 after parse copy", async () => {
        await waitTest(1);
        var result = (await readFile(path.join(resources, `watchSortedSortedByBeforeAfter/output/parseCopy/1.vmt`))).toString();
        assert.strictEqual(result, "I'm 1 <% template('2.vmi');%>", `Output mismatch`);
        await waitTest(1);
        await rimraf(path.join(resources, `watchSortedSortedByBeforeAfter/output/parse/1.txt`));            
        await waitTest(2);
        await writeFile(path.join(resources, `watchSortedSortedByBeforeAfter/input/parseCopy/1.vmt`), "Test2");
        await waitTest(2);
        var exists = true;
        try {
            await statFile(path.join(resources, `watchSortedSortedByBeforeAfter/output/parse/1.txt`));
        } catch (error) {
            exists = false;
        }
        assert.isOk(exists, "Parse 1.txt should exist");
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