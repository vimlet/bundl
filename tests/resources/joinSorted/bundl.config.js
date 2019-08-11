module.exports = {
    inputBase:"tests/resources/joinSorted",
    outputBase:"tests/resources/joinSorted",
    output: {

        // --- Output String ---
        "output/join1.txt": "input/**.txt",

        // // ---  Output Object ---
        "output/join2.txt": {
            input: "input/**.txt",
            order: 2
        },
        "output/join3.txt": {
            input: {
                "input/**.txt": true
            },
            order: 3
        },
        "output/join4.txt": {
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ],
            order: 4
        },
        
        // // --- Output Array ---
        "output/join5.txt": [
            "input/a.txt",
            "input/b.txt",
            "input/c.txt"
        ],
        // "output/join6.txt": [
        //     {
        //         input: "input/a.txt"
        //     },
        //     {
        //         input: {
        //             "input/b.txt": true
        //         }
        //     },
        //     {
        //         input: {
        //             "input/c.txt": true
        //         }
        //     }
        // ]
        // "output/join7.txt": [
        //     {
        //         input: [
        //             "input/a.txt",
        //             "input/b.txt",
        //             {
        //                 "input/c.txt": true
        //             }
        //         ]
        //     }
        // ]

    }
}

// El caso 6 no es posible, no puede haber un array de output donde haya objetos, puesto que output tiene configuraciones únicas como el use del output o el order, si son objetos, cada objeto podria tener su order y su use y explotaria.
// El caso 7 es mas de lo mismo, el output solo puede ser un array de strings o un unico objeto