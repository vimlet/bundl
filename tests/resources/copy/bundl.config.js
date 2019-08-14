module.exports = {
    inputBase:"tests/resources/copy",
    outputBase:"tests/resources/copy",
    output: {

        // --- Output String ---
        "output/1/**": "input/**.txt",

        // // ---  Output Object ---
        "output/2/**": {
            input: "input/**.txt"
        },
        "output/3/**": {
            input: {
                "input/**.txt": true
            }
        },
        "output/4/**": {
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ]
        },
        
        // // --- Output Array ---
        "output/5/**": [
            "input/a.txt",
            "input/b.txt",
            "input/c.txt"
        ]
    }
}
