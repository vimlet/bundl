module.exports = {
    inputBase: "tests/resources/input",
    outputBase: "tests/resources/input",
    output: {

        // Invalid input. It is treated as different input objects
        //[{input:{"**":true}},{input:{"!input/b.txt":true}}]
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
        "output/input3.txt": {
            input: {
                "input/**": {
                    use: function (entry) {
                        entry.content = entry.content + "\nd";
                        return entry;
                    }
                },
                "!input/b.txt": true
            }
        },
        "output/input4.txt": {
            input: {
                "input/**": true,
                "!input/b.txt": true
            }
        }
    }
}