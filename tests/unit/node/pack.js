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
const pack = require('../../../src/lib/pack');
let output = path.join(__dirname, "../output");

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
        var files = await Promise.all(await copy.process(config, "copy/**"));
        var expected = 4;
        assert.strictEqual(files.length, expected, "Copy expected " + expected);
    });
    test("command", async () => {
        await run.exec('metapack', {
            args: ["-c", "../resources/config/command.js"],
            workingDirectory: __dirname
        });
        let files = await glob.files("**/output/command/**");            
        var expected = 9;  
        assert.strictEqual(files.length, expected, "Command expected " + expected);
    });
    test("metapack", async () => {        
        var config = require("../resources/config/metapack");
        await pack.build(config);
        let files = await glob.files("**/output/metapack/**");
        var expected = 9;       
        assert.strictEqual(files.length, expected, "Metapack expected " + expected);
    });
    test("watch", async () => { 
        var config = require("../resources/config/watch");
        await pack.build(config);
        let files = await glob.files("**/output/watch/**");
        var expected = 5;       
        assert.strictEqual(files.length, expected, "Watch expected " + expected);
    });
});