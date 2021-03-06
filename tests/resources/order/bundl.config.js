module.exports = {
    inputBase: "tests/resources/order",
    outputBase: "tests/resources/order",
    output: {
        "output/order1.txt": {
            use: async function (entry) {                            
                await waitTest(5);                 
                entry.content =  new Date().getTime();           
                return entry;
            },
            input: "input/**.txt",
            order: 1
        },
        "output/order2.txt": {
            use: async function (entry) {
                await waitTest(3);
                entry.content =  new Date().getTime();
                return entry;
            },
            input: {
                "input/**.txt": true
            },
            order: 2
        },
        "output/order3.txt": {
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
            order: 3
        },
        "output/order4.txt": {
            use: async function (entry) {
                await waitTest(2);
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