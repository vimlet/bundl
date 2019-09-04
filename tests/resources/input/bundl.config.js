module.exports = {
    inputBase:"tests/resources/input",
    outputBase:"tests/resources/input",
    output: {
        "output/input1.txt": [
            "input/**",
            "!input/b.txt"
        ],
        "output/input2.txt": {
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ]
        },
    }
}