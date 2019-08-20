module.exports = {
    inputBase: "tests/resources/copyBefore",
    outputBase: "tests/resources/copyBefore",
    output: {

        // // ---  Output Object ---
        "output/1/**": {
            use: async function (entry) {
                await waitTest(3);
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            "before": "2 3"
        },
        "output/2/**": {
            id:"2",
            use: async function (entry) {                            
                await waitTest(2);                 
                entry.content =  new Date().getTime();           
                return entry;
            },
            input: {
                "input/**.txt": true
            }
        },
        "output/3/**": {
            id: "3",
            use: async function (entry) { 
                await waitTest(0);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ]
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