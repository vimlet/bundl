module.exports = {
    inputBase: "resources",
    outputBase: "resources",
    output: {
        "output/allTogether.txt": {
            input: {
                "input/**": true
            },
            keepSort: true
        }
    }
}