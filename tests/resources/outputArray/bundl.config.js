module.exports = {
    inputBase: "tests/resources/outputArray",
    outputBase: "tests/resources/outputArray",
    output: {

        // --- Copy ---
        "output/copy/**": [{
                "input": "input/a.txt"
            },
            {
                "input": ["input/b.txt"]
            },
            {
                "input": {
                    "input/c.txt": true
                }
            }
        ],
        // --- Copy order ---
        "output/copyOrder/**": [{
                "input": "input/a.txt"
            },
            {
                use: async function (entry) {
                    await waitTest(0);
                    return entry;
                },
                "input": ["input/b.txt"],
                order: 2
            },
            {
                use: async function (entry) {
                    await waitTest(2);
                    return entry;
                },
                order: 0,
                "input": {
                    "input/c.txt": true
                }
            }
        ],
        // --- Transform ---
        "output/join.txt": [{
                "input": "input/a.txt"
            },
            {
                "input": ["input/b.txt"]
            },
            {
                "input": {
                    "input/c.txt": true
                }
            }
        ],
        // --- Transform order ---
        "output/joinOrder.txt": [{
                "input": "input/a.txt"
            },
            {
                use: async function (entry) {
                    await waitTest(0);
                    return entry;
                },
                "input": ["input/b.txt"],
                order: 2
            },
            {
                use: async function (entry) {
                    await waitTest(2);
                    return entry;
                },
                order: 0,
                "input": {
                    "input/c.txt": true
                }
            }
        ]
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