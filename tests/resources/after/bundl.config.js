module.exports = {
    inputBase: "tests/resources/after",
    outputBase: "tests/resources/after",
    output: {
        "output/after1.txt": {
            id:"1",
            use: async function (entry) {                            
                await waitTest(5);                 
                entry.content =  new Date().getTime();           
                return entry;
            },
            input: "input/**.txt"
        },
        "output/after2.txt": {
            id:"2",
            use: async function (entry) {                
                await waitTest(3);
                entry.content =  new Date().getTime();
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            after:"1 4 5"
        },
        "output/after3.txt": {
            id:"3",
            use: async function (entry) {                
                await waitTest(1);
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
            after:"2"
        },
        "output/after4.txt": {
            id:"4",
            use: async function (entry) {
                await waitTest(2);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt"
        },
        "output/after5.txt": {
            id:"5",
            use: async function (entry) {
                await waitTest(7);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt"
        },
        "output/after6.txt": {
            id:"6",
            use: async function (entry) {                
                await waitTest(1);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt",
            after:"5"
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