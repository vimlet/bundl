const {
  promisify
} = require("util");
const fs = require("fs");
const path = require("path");
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

module.exports = {
  inputBase: "tests/resources/watchSortedSortedByBeforeAfter/input",
  outputBase: "tests/resources/watchSortedSortedByBeforeAfter",
  watch: "tests/resources/watchSortedSortedByBeforeAfter/input",
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
      after: "parse",
      "input": {
        "parseCopy/**": {
          "watch": ["parseCopy/**"]
        }
      }
    }
  }
}