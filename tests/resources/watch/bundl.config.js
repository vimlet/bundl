const {
    promisify
} = require("util");
const fs = require("fs");
const path = require("path");
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

module.exports = {
    inputBase: "tests/resources/watch",
    outputBase: "tests/resources/watch",
    watch: "tests/resources/watch",
    output: {

        // --- Added file to transform ---
        "output/watch1.txt": "input/**.txt",


        // --- Modify file of transform ---
        "output/watch2.txt": {
            id: "watch2",
            input: [
                "input/a.txt",
                "input/b.txt",
                {
                    "input/c.txt": true
                }
            ]
        },


        "output/watch3.txt": {
            before: "task3",
            input: "input/**.txt"
        },

        // --- Added file to copy ---
        "output/1/**": "input/**.txt",


        // --- Added file to copy ---
        "output/2/**": {
            order: 1,
            input: "input/**.txt"
        },


    },
    tasks: {
        task1: {
            after: "watch2",
            use: async function (prev, bundl) {
                try {
                    await mkdir(path.join(__dirname, 'output/task'), {
                        recursive: true
                    });
                    await writeFile(path.join(__dirname, 'output/task/task1.txt'), "Task1");
                    console.log("File created by task1");
                } catch (error) {
                    console.log("bundl task USE crash");
                }
            }
        },
        task2: {
            order: 2,
            use: async function (prev, bundl) {
                try {
                    await mkdir(path.join(__dirname, 'output/task'), {
                        recursive: true
                    });
                    await writeFile(path.join(__dirname, 'output/task/task2.txt'), "Task2");
                    console.log("File created by task2");
                } catch (error) {
                    console.log("bundl task USE crash");
                }
            }
        },
        task3: {
            use: async function (prev, bundl) {
                try {
                    await mkdir(path.join(__dirname, 'output/task'), {
                        recursive: true
                    });
                    await writeFile(path.join(__dirname, 'output/task/task3.txt'), "Task3");
                    console.log("File created by task3");
                } catch (error) {
                    console.log("bundl task USE crash");
                }
            }
        }
    }
}