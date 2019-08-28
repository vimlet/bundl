module.exports = {
    inputBase: "tests/resources/readFalse",
    outputBase: "tests/resources/readFalse",
    output: {

        // --- Transform ---
        "output/transform.txt": {
            input: [{
                "input/c.txt": {
                    read: false
                }
            }]
        },

        // --- Copy ---
        "output/copy/**": {
            input: {
                "input/*.txt": {
                    read: false
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