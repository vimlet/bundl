module.exports = {
    inputBase: "tests/resources/parse",
    outputBase: "tests/resources/parse",
    output: {
        "output/1/build.{{hash}}.js?": {
            id: "build",
            input: "input/**.txt",
            order: 1
        },
        "output/2/parse.txt": {
            input: "input/**.txt"
        },
        "output/3/meta.txt": {
            input: {
                "input/**.vmt": {},
                "!input/metadata/**.vmt":{}
            },
            parse: true
        },
        "output/4/index.html?parse=true": {
            input: {
                "input/index.html": {
                }
            },
            order: 2
        },
        "output/5/**?parse=true": {
            input: {
                "input/**.vmt": {
                },
                "!input/metadata/**.vmt":{}
            },
            use:async function(entry){
                entry.path = entry.path.replace(".vmt",".txt");
                return entry;
            },
            order: 2
        },
        "output/6/file.html?parse=true": {
            input: {
                "input/file.html": {
                }
            },
            order: 2
        },
        "output/7/filename.html?parse=true": {
            input: {
                "input/filename.html": {
                }
            },
            order: 2
        },
        "output/8/meta.txt": {
            input: {
                "input/metadata/**.vmt": {
                }
            },
            parse: {name:"data"}
        },
        "output/9/**": {
            input: {
                "input/metadata/**.vmt": {
                }
            },
            use:async function(entry){
                entry.path = entry.path.replace(".vmt",".txt");
                return entry;
            },
            parse: {name:"data"}
        },
        "output/10/meta.txt": {
            input: {
                "input/meta.vmt": {
                    parse: true}
            }
        },
        "output/11/meta.txt": {
            input: {
                "input/metadata/**.vmt": {
                    parse: {name:"data"}
                }
            }
        },
        "output/12/**": {
            input: {
                "input/metadata/**.vmt": {
                    parse: {name:"data"}
                }
            },
            use:async function(entry){
                entry.path = entry.path.replace(".vmt",".txt");
                return entry;
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