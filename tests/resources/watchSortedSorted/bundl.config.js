const {
  promisify
} = require("util");
const fs = require("fs");
const path = require("path");
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

module.exports = {
  inputBase: "tests/resources/watchSortedSorted/input",
  outputBase: "tests/resources/watchSortedSorted",
  watch: "tests/resources/watchSortedSorted/input",
  watchMode:"sorted",
  log: false,
  output: {
    "output/copy/**": {
      "order": 3,
      "input": {
        "copy/**": {
          "watch": ["copy/**"]
        }
      }
    },
    "output/parse/1.txt": {
      id: "parse",
      "order": 0,
      "parse": true,
      "input": {
        "parse/**.vmt": {
          "parse": true,
          "watch": "parse/**"
        }
      }
    },
    "output/parseCopy/**": {
      id: "parseCopy",
      "input": {
        "parseCopy/**": {
          "watch": ["parseCopy/**"]
        }
      }
    }
  },
  task: {
    task1: {
      after: "parseCopy",
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
      order:5,
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
    }
  }
}