module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": false,
  "output": {
    "transformOutput.js": {
        use: async function (entry) {
            await waitTest(2);
            entry.content = "First function";
            return entry;
        },
        input: {
            "js/**.js": true
        }
    },
    "transformOutputMulti.js": {
        use: [async function (entry) {
            await waitTest(2);
            entry.content = "First function";
            return entry;
        }, async function (entry) {
            entry.content += "Second function";
            return entry;
        }],
        input: {
            "js/**.js": true
        }
    },
    "trasnformInput.js": {
        input: {
            "js/**.js": {
                use: async function (entry) {                        
                    await waitTest(2);
                    entry.content = "First function";
                    return entry;
                }
            }
        }
    },
    "trasnformInputMulti.js": {
        input: {
            "js/**.js": {
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
    "copyOutput/**": {
        use: async function (entry) {
            await waitTest(2);
            entry.content = "First function";
            return entry;
        },
        input: {
            "js/**.js": true
        }
    },
    "copyOutputMulti/**": {
        use: [async function (entry) {
            await waitTest(2);
            entry.content = "First function";
            return entry;
        }, async function (entry) {
            entry.content += "Second function";
            return entry;
        }],
        input: {
            "js/**.js": true
        }
    },
    "copyInput/**": {
        input: {
            "js/**.js": {
                use: async function (entry) {                        
                    await waitTest(2);
                    entry.content = "First function";
                    return entry;
                }
            }
        }
    },
    "copyInputMulti/**": {
        input: {
            "js/**.js": {
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
};


function waitTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Waited for");
    }, 100);
  });
}