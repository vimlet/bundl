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
            "outputBase":path.join(output, "clean"),
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
        fs.stat(path.join(output, "clean"), (err, stats)=>{
            assert.strictEqual(err.code, "ENOENT", "Expected ENOENT");
        });
    });
    test("copy", async () => {
        const copy = require('../../../src/lib/copy');
        var config = {
            "outputBase":path.join(output, "clean"),
            "inputBase":path.join(resources,"input"),
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
        await copy.process(config, "copy/**");
    });
    test("metapack", async () => {
    });
});