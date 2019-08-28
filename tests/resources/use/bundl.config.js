module.exports = {
    inputBase: "tests/resources/use",
    outputBase: "tests/resources/use",
    output: {

        // // ---  Output transform single use ---
        "output/use1.txt": {
            use: async function (entry) {
                await waitTest(2);
                entry.content = "First function";
                return entry;
            },
            input: {
                "input/**.txt": true
            }
        },
        // // ---  Output transform multiple use ---
        "output/use2.txt": {
            use: [async function (entry) {
                await waitTest(2);
                entry.content = "First function";
                return entry;
            }, async function (entry) {
                entry.content += "Second function";
                return entry;
            }],
            input: {
                "input/**.txt": true
            }
        },
        // // ---  Input transform single use ---
        "output/use3.txt": {
            input: {
                "input/**.txt": {
                    use: async function (entry) {                        
                        await waitTest(2);
                        entry.content = "First function";
                        return entry;
                    }
                }
            }
        },
        // // ---  Input transform multiple use ---
        "output/use4.txt": {
            input: {
                "input/**.txt": {
                    use: [async function (entry) {
                        await waitTest(2);
                        entry.content = "First function";
                        return entry;
                    }, async function (entry) {
                        entry.content += "Second function";
                        return entry;
                    }]
                }
            }
        },
        // // ---  Output copy single use ---
        "output/5/**": {
            use: async function (entry) {
                await waitTest(2);
                entry.content = "First function";
                return entry;
            },
            input: {
                "input/**.txt": true
            }
        },
        // // ---  Output copy multiple use ---
        "output/6/**": {
            use: [async function (entry) {
                await waitTest(2);
                entry.content = "First function";
                return entry;
            }, async function (entry) {
                entry.content += "Second function";
                return entry;
            }],
            input: {
                "input/**.txt": true
            }
        },
        // // ---  Input copy single use ---
        "output/7/**": {
            input: {
                "input/**.txt": {
                    use: async function (entry) {                        
                        await waitTest(2);
                        entry.content = "First function";
                        return entry;
                    }
                }
            }
        },
        // // ---  Input copy multiple use ---
        "output/8/**": {
            input: {
                "input/**.txt": {
                    use: [async function (entry) {
                        await waitTest(2);
                        entry.content = "First function";
                        return entry;
                    }, async function (entry) {
                        entry.content += "Second function";
                        return entry;
                    }]
                }
            }
        }
    }
}


function waitTest(amount) {
    return new Promise((resolve, reject) => {
        amount = amount || 1;
        setTimeout(() => {
            resolve("Waited for");
        }, (500 * amount));
    });
}