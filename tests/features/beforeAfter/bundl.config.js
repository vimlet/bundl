module.exports = {
    "clean": true,
    "log": false,
    "output": {
        "output/sort/unsorted/**": [{
            "input": {
                "output/sort/**": {
                    "use": function (entry) {
                        entry.path = entry.path.replace(".txt", ".css");
                        return entry;
                    }
                }
            }
        }],
        "output/sort/all/**": [{
            "order": 0,
            "id": "0",
            "input": "output/sort/before/**"
        }],
        "output/sort/before/**": {
            "before": "0",
            "input": "input/sort/**"
        },
        "output/sort/after/**": {
            "after": "0",
            "input": "output/sort/all/**"
        }
    }
};