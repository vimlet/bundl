module.exports = {
    inputBase:"tests/resources/watch",
    outputBase:"tests/resources/watch",
    watch:"tests/resources/watch",
    output: {

        // --- Added file to transform ---
        "output/watch1.txt": "input/**.txt",

        // --- Modify file of transform ---
        "output/watch2.txt": {
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