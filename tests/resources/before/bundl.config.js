module.exports = {
    inputBase: "tests/resources/before",
    outputBase: "tests/resources/before",
    output: {
        "output/before1.txt": {
            id:"1",
            use: async function (entry) {                            
                await waitTest(3);                 
                entry.content =  new Date().getTime();           
                return entry;
            },
            input: "input/**.txt",
            "before": "2 3"
        },
        "output/before2.txt": {
            id: "2",
            use: async function (entry) {
                await waitTest(2);
                entry.content =  new Date().getTime();
                return entry;
            },
            input: {
                "input/**.txt": true
            }
        },
        "output/before3.txt": {
            id: "3",
            use: async function (entry) { 
                console.log("LAUNCH 3");
                
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
        },
        "output/before4.txt": {
            use: async function (entry) {      
                entry.content =  new Date().getTime(); 
                return entry;
            },
            input: "input/**.txt",
            before: "2"
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