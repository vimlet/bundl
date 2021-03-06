module.exports = {
    inputBase: "tests/resources/mixedSort",
    outputBase: "tests/resources/mixedSort",
    output: {
        "output/mixedSort1.txt": {
            use: async function (entry) {                                
                await waitTest(5);
                entry.content = new Date().getTime();                                
                return entry;
            },
            input: "input/**.txt",
            order: 1
        },
        "output/mixedSort2.txt": {
            use: async function (entry) {             
                await waitTest(6);
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
                await waitTest(1);
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
                await waitTest(2);                
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            order: 1
        },
        "output/mixedSort5.txt": {
            use: async function (entry) {                
                await waitTest(2);
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt"
        },
        "output/mixedSort6.txt": {
            use: async function (entry) {
                await waitTest(1);
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt"
        },
        "output/mixedSort7.txt": [{
            use: async function (entry) { 
                await waitTest(1); 
                entry.content = new Date().getTime();                                            
                return entry;
            },
            input: "input/**.txt"
        }, {
            use: async function (entry) {                             
                await waitTest(2);
                entry.content = new Date().getTime();  
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            order: 2
        }],
        "output/mixedSort8.txt": {
            id:"8",
            use: async function (entry) {
                await waitTest(5);                
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            before: "9"
        },
        "output/mixedSort9.txt": {
            id:"9",
            use: async function (entry) {
                await waitTest(3);
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt"
        },
        "output/mixedSort10.txt": [{
            use: async function (entry) {
                await waitTest(9);
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            before: "8"
        }, {
            use: async function (entry) {
                await waitTest(2);
                entry.content = new Date().getTime();
                return entry;
            },
            input: {
                "input/**.txt": true
            }
        }],
        "output/mixedSort11.txt": {
            use: async function (entry) {
                await waitTest(3);
                entry.content = new Date().getTime();
                return entry;
            },
            input: "input/**.txt",
            before:"8"
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