module.exports = {
    inputBase: "tests/resources/rename",
    outputBase: "tests/resources/rename",
    output: {

        // ---  Output copy single use ---
        "output/1/**": {
            use: async function (entry) {                
                await waitTest(2);
                entry.path = entry.path.replace(new RegExp(/.txt/,"g"), ".html");
                return entry;
            },
            input: {
                "input/**.txt": true
            }
        },
        // // ---  Output copy multiple use ---
        "output/2/**": {
            use: [async function (entry) {
                await waitTest(2);
                entry.path = entry.path.replace(new RegExp(/.txt/,"g"), ".html");
                return entry;
            }, async function (entry) {
                entry.path = entry.path.replace(new RegExp(/.html/,"g"), ".js");
                return entry;
            }],
            input: {
                "input/**.txt": true
            }
        },
        // // ---  Input copy single use ---
        "output/3/**": {
            input: {
                "input/**.txt": {
                    use: async function (entry) {                        
                        await waitTest(2);
                        entry.path = entry.path.replace(new RegExp(/.txt/,"g"), ".html");
                        return entry;
                    }
                }
            }
        },
        // ---  Input copy multiple use ---
        "output/4/**": {
            input: {
                "input/**.txt": {
                    use: [async function (entry) {
                        await waitTest(2);
                        entry.path = entry.path.replace(new RegExp(/.txt/,"g"), ".html");                        
                        return entry;
                    }, async function (entry) {                        
                        entry.path = entry.path.replace(new RegExp(/.html/,"g"), ".js");                        
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
        }, (100 * amount));
    });
}