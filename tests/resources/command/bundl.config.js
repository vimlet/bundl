module.exports = {
    inputBase: "tests/resources/command",
    outputBase: "tests/resources/command",
    output: {
        
        // --- Transform join ---
        "output/join.txt": {
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ]
        },
        
        // --- Copy ---
        "output/copy/**": [
            "input/a.txt",
            "input/b.txt",
            "input/c.txt"
        ],

        // --- Sort ---
        "output/sort1.txt": {
            use: async function (entry) {                            
                await waitTest(4);                 
                entry.content =  new Date().getTime();           
                return entry;
            },
            input: "input/**.txt",
            order: 1
        },
        "output/sort2.txt": {
            use: async function (entry) {
                await waitTest(2);
                entry.content =  new Date().getTime();
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            order: 2
        },
        "output/sort3.txt": {
            use: async function (entry) { 
                await waitTest(2);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ],
            order: 3
        },
        "output/sort4.txt": {
            use: async function (entry) {                
                await waitTest(1);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt",
            order: 1
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