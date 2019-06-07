const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

const promisify = require("util").promisify;
const fs = require("fs");
const path = require("path");
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const run = require("@vimlet/commons-run");
const glob = require("@vimlet/commons-glob");
let output = path.join(__dirname, "../output");
let resources = path.join(__dirname, "../resources");

suite("metapack", () => {
    test("clean", async () => {
        const clean = require('../../../src/lib/clean');
        await mkdir(path.join(output, "clean"), {
            recursive: true
        });
        await writeFile(path.join(output, "clean", "test.txt"), "test");
        var config = {
            "outputBase": path.join(output, "clean"),
            "output": {
                "**": {
                    "clean": true,
                    "input": {
                        "copy/**": true
                    }
                }
            }
        };
        await clean(config);
        fs.stat(path.join(output, "clean"), (err, stats) => {
            assert.strictEqual(err.code, "ENOENT", "Expected ENOENT");
        });
    });
    test("copy", async () => {
        const copy = require('../../../src/lib/copy');
        var config = {
            "outputBase": "tests/unit/output/copy",
            "inputBase": "tests/unit/resources/input",
            "output": {
                "copy/**": {
                    "clean": true,
                    "order": 0,
                    "input": {
                        "copy/**": true
                    }
                }
            }
        };
        var copyP = JSON.stringify(await Promise.all(await copy.process(config, "copy/**")));
        var expected = [{"outputParent":"tests/unit/output/copy/tests/unit/resources/input/copy","outputPath":"tests/unit/output/copy/tests/unit/resources/input/copy/test1.txt","content":{"type":"Buffer","data":[116,101,115,116,49]}},{"outputParent":"tests/unit/output/copy/tests/unit/resources/input/copy","outputPath":"tests/unit/output/copy/tests/unit/resources/input/copy/test2.txt","content":{"type":"Buffer","data":[116,101,115,116,50]}},{"outputParent":"tests/unit/output/copy/tests/unit/resources/input/copy","outputPath":"tests/unit/output/copy/tests/unit/resources/input/copy/noextension","content":{"type":"Buffer","data":[]}},{"outputParent":"tests/unit/output/copy/tests/unit/resources/input/copy/folder","outputPath":"tests/unit/output/copy/tests/unit/resources/input/copy/folder/folder.js","content":{"type":"Buffer","data":[34,73,110,32,102,111,108,100,101,114,34,59]}}];
        var has = true;
        expected.forEach(element=>{            
            if(!copyP.includes(JSON.stringify(element))){
                has = false;
            }
        });
        assert.isOk(has, 'copy test is not full');
    });
    test("command", async () => {
        run.exec('metapack', {
            args: ["-c", "../resources/config/command.js"],
            workingDirectory: __dirname
        }, async function (error, data) {
            setTimeout(async () => {
                let files = await glob.files("**/output/command/input/**");
                var expected = 5;            
                assert.strictEqual(files.length, expected, "Command expected " + expected);
            }, 1000);
        });
    });
    test("metapack", async () => {        
        var config = require("../resources/config/metapack");
        const pack = require('../../../src/lib/pack');
        await pack.build(config);
        let files = await glob.files("**/output/metapack/**");
        var expected = 9;       
        assert.strictEqual(files.length, expected, "Metapack expected " + expected);
    });
});