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
const readFile = promisify(fs.readFile);
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
        var files = await Promise.all(await copy.process(config, {
            "clean": true,
            "order": 0,
            "input": {
                "copy/**": true
            },
            "outPath": "copy/**"
        }));
        var expected = 4;
        assert.strictEqual(files.length, expected, "Copy expected " + expected);
    });
    test("command", async () => {
        await run.exec('metapack', {
            args: ["-c", "../resources/config/command.js"],
            workingDirectory: __dirname
        });
        console.log("LEO FILES");
        
        let files = await glob.files("output/command/**", {
            path: path.join(__dirname, "../")
        });
        var expected = 9;
        assert.strictEqual(files.length, expected, "Command expected " + expected);
    });
    test("metapack", async () => {
        var config = require("../resources/config/metapack");
        await pack.build(config);
        let files = await glob.files("output/metapack/**", {
            path: path.join(__dirname, "../")
        });
        var expected = 9;
        assert.strictEqual(files.length, expected, "Metapack expected " + expected);
    });
    test("watch", async () => {
        var config = require("../resources/config/watch");
        await pack.build(config);
        let files = await glob.files("output/watch/**", {
            path: path.join(__dirname, "../")
        });
        var expected = 5;
        assert.strictEqual(files.length, expected, "Watch expected " + expected);
    });
    test("copy modify extension", async () => {
        var config = require("../resources/config/extension");
        await pack.build(config);
        let files = await glob.files("output/extension/**.css", {
            path: path.join(__dirname, "../")
        });
        var expected = 2;
        assert.strictEqual(files.length, expected, "Modify extension expected " + expected);
    });
    test("input use", async () => {
        var config = {
            "outputBase": "tests/unit/output/empty",
            "inputBase": "tests/unit/resources/input",
            "clean": false,
            "log": false,
            "output": {
                "input.use?clean=false": {
                    "input": {
                        "empty.com": {
                            use: function (entry) {
                                entry.content += "input use";
                                return entry;
                            }
                        }
                    }
                }
            }
        };
        await pack.build(config);
        var result = await readFile(path.join(__dirname, "../output/empty/input.use"), "utf8");
        var expected = "input use";
        assert.strictEqual(result, expected, "Input use expected " + expected);
    });
    test("output use", async () => {
        var config = {
            "outputBase": "tests/unit/output/empty",
            "inputBase": "tests/unit/resources/input",
            "clean": false,
            "log": false,
            "output": {
                "output.use?clean=false": {
                    "input": {
                        "empty.com": true
                    },
                    use: function (entry) {
                        entry.content += "output use";
                        return entry;
                    }
                }
            }
        };
        await pack.build(config);
        var result = await readFile(path.join(__dirname, "../output/empty/output.use"), "utf8");
        var expected = "output use";
        assert.strictEqual(result, expected, "Output use expected " + expected);
    });
    test("input use await", async () => {
        var config = {
            "outputBase": "tests/unit/output/empty",
            "inputBase": "tests/unit/resources/input",
            "clean": false,
            "log": false,
            "output": {
                "input.await?clean=false": {
                    "input": {
                        "empty.com": {
                            use: async function (entry) {
                                entry.content += await waitTest() + " input use";
                                return entry;
                            }
                        }
                    }
                }
            }
        };

        function waitTest() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("Waited for");
                }, 200);
            });
        }
        await pack.build(config);
        var result = await readFile(path.join(__dirname, "../output/empty/input.await"), "utf8");
        var expected = "Waited for input use";
        assert.strictEqual(result, expected, "Input use await expected " + expected);
    });
    test("output use await", async () => {
        var config = {
            "outputBase": "tests/unit/output/empty",
            "inputBase": "tests/unit/resources/input",
            "clean": false,
            "log": false,
            "output": {
                "output.await?clean=false": {
                    "input": {
                        "empty.com": true
                    },
                    use: async function (entry) {
                        entry.content += await waitTest() + " output use";
                        return entry;
                    }
                }
            }
        };

        function waitTest() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("Waited for");
                }, 200);
            });
        }
        await pack.build(config);
        var result = await readFile(path.join(__dirname, "../output/empty/output.await"), "utf8");
        var expected = "Waited for output use";
        assert.strictEqual(result, expected, "Output use await expected " + expected);
    });
    test("read false copy", async () => {
        var config = {
            "outputBase": "tests/unit/output/read",
            "inputBase": "tests/unit/resources/input",
            "clean": false,
            "log": false,
            "output": {
                "**?clean=false": {
                    "input": {
                        "read/**": {
                            read: false
                        }
                    }
                }
            }
        };
        await pack.build(config);
        var result = await readFile(path.join(__dirname, "../output/read/text.txt"), "utf8");
        var expected = "";
        assert.strictEqual(result, expected, "Read false copy expected " + expected);
    });
    test("read false transform", async () => {
        var config = {
            "outputBase": "tests/unit/output/read",
            "inputBase": "tests/unit/resources/input",
            "clean": false,
            "log": false,
            "output": {
                "textOut.txt?clean=false": {
                    "input": {
                        "read/**": {
                            read: false
                        }
                    }
                }
            }
        };
        await pack.build(config);
        var result = await readFile(path.join(__dirname, "../output/read/textOut.txt"), "utf8");
        var expected = "";
        assert.strictEqual(result, expected, "Read false transform expected " + expected);
    });
    test("sort", async () => {
        var config = {
            "outputBase": "tests/unit",
            "inputBase": "tests/unit",
            "clean": false,
            "log": false,
            "output": {
                "/output/sort/**": [{
                    "input": {
                        "output/sort/**": {
                            "use": function (entry) {
                                entry.fileName = entry.fileName.replace(".txt", ".css");
                                return entry;
                            }
                        }
                    }
                }, {
                    "order": 0,
                    "input": {
                        "resources/input/sort/**": {
                            "use": function (entry) {
                                return entry;
                            }
                        }
                    }
                }]
            }
        };
        await pack.build(config);
        let files = await glob.files("output/sort/**", {
            path: path.join(__dirname, "../")
        });
        var expected = 2;
        assert.strictEqual(files.length, expected, "Sort expected " + expected);
    });
    test("parse", async () => { 
        var config = require("../resources/config/parse");
        await pack.build(config);
        var expected = "I am aI am b";
        var result = (await readFile(path.join(__dirname, "../output/parse/a.txt"), "utf8")).replace(/(\r\n|\n|\r)/gm, "");
        assert.strictEqual(result, expected, "Parse expected " + expected);
    });
    test("parse copy", async () => { 
        var config = require("../resources/config/parseCopy");
        await pack.build(config);
        var expected = "I am aI am b";
        var result = (await readFile(path.join(__dirname, "../output/parseCopy/a.vmt"), "utf8")).replace(/(\r\n|\n|\r)/gm, "");
        assert.strictEqual(result, expected, "Parse expected " + expected);
    });
    test("transform", async () => { 
        var config = require("../resources/config/transform");
        await pack.build(config);
        var expected = "123";
        var result = (await readFile(path.join(__dirname, "../output/transform/a.txt"), "utf8")).replace(/(\r\n|\n|\r)/gm, "");        
        assert.strictEqual(result, expected, "Parse expected " + expected);
    });
});