module.exports = {
    inputBase: "tests/resources/mixedOrder",
    outputBase: "tests/resources/mixedOrder",
    output: {
        "output/mixedSort1.txt": {
            use: async function (entry) {                                
                await waitTest(4);
                entry.content = new Date().getTime();                                
                return entry;
            },
            input: "input/**.txt",
            order: 1
        },
        "output/mixedSort2.txt": {
            use: async function (entry) {             
                await waitTest(5);
                entry.content = new Date().getTime(); 
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            order: 2
        },
        "output/mixedSort3.txt": {
            use: async function (entry) {
                entry.content = new Date().getTime();
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
        "output/mixedSort4.txt": {
            use: async function (entry) {                
                await waitTest(1);                
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            order: 1
        },
        "output/mixedSort5.txt": {
            use: async function (entry) {                
                await waitTest(1);
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt"
        },
        "output/mixedSort6.txt": {
            use: async function (entry) {
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt"
        },
        "output/mixedSort7.txt": [{
            use: async function (entry) {  
                entry.content = new Date().getTime();                                            
                return entry;
            },
            input: "input/**.txt"
        }, {
            use: async function (entry) {                             
                await waitTest(1);
                entry.content = new Date().getTime();  
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            order: 2
        }]
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