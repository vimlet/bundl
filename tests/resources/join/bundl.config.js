module.exports = {
    output: {

        // --- Output String ---
        "tests/resources/join/output/join1.txt": "tests/resources/join/input/**.txt",

        // ---  Output Object ---
        "tests/resources/join/output/join2.txt": {
            input: "tests/resources/join/input/**.txt"
        },
        "tests/resources/join/output/join3.txt": {
            input: {
                "tests/resources/join/input/**.txt": true
            }
        },
        "tests/resources/join/output/join4.txt": {
            input: [
                "tests/resources/join/input/a.txt",
                "tests/resources/join/input/b.txt",
                {
                    "tests/resources/join/input/c.txt": true
                }
            ]
        },
        
        // --- Output Array ---
        "tests/resources/join/output/join5.txt": [
            "tests/resources/join/input/a.txt",
            "tests/resources/join/input/b.txt",
            "tests/resources/join/input/c.txt"
        ],
        "tests/resources/join/output/join6.txt": [
            {
                input: "tests/resources/join/input/a.txt"
            },
            {
                input: {
                    "tests/resources/join/input/b.txt": true
                }
            },
            {
                input: {
                    "tests/resources/join/input/c.txt": true
                }
            }
        ],
        "tests/resources/join/output/join7.txt": [
            {
                input: [
                    "tests/resources/join/input/a.txt",
                    "tests/resources/join/input/b.txt",
                    {
                        "tests/resources/join/input/c.txt": true
                    }
                ]
            }
        ]

    }
}