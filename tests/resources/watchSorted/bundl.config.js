module.exports = {
    inputBase:"tests/resources/watchSorted",
    outputBase:"tests/resources/watchSorted",
    watchSorted:"tests/resources/watchSorted",
    output: {

        // --- Added file to transform ---
        "output/watchSorted1.txt": "input/**.txt",

        // --- Modify file of transform ---
        "output/watchSorted2.txt": {
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ]
        },        
        
        // --- Added file to copy ---
        "output/1/**": "input/**.txt",


    }
}