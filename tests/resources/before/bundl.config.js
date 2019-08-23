module.exports = {
    inputBase: "tests/resources/before",
    outputBase: "tests/resources/before",
    output: {
        "output/before1.txt": {
            id:"1",
            use: async function (entry) {                            
                await waitTest(4);                 
                entry.content =  new Date().getTime();           
                return entry;
            },
            input: "input/**.txt",
            before:"2"
        },
        "output/before2.txt": {
            id:"2",
            use: async function (entry) {
                await waitTest(2);
                entry.content =  new Date().getTime();
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            before:"3"
        },
        "output/before3.txt": {
            id:"3",
            use: async function (entry) { 
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
        },
        "output/before4.txt": {
            id:"4",
            use: async function (entry) {
                await waitTest(1);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt",
            before:"2"
        },
        "output/before5.txt": {
            id:"5",
            use: async function (entry) {
                await waitTest(6);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt",
            before:"2 6"
        },
        "output/before6.txt": {
            id:"6",
            use: async function (entry) {                
                await waitTest(0);
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt"
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