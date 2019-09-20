module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": false,
  "watch": "input",
  "output": {
    "copy/**": [{
      "order": 1,
      "input": {
        "copy/**": {
          "watch": ["copy/**"]
        }
      }
    }],
    "parseCopy/**": [{
      "order": 2,
      "input": {
        "parseCopy/**": {
          "watch": ["parseCopy/**"]
        }
      },
      use: async function (entry, bundl) {
        console.log("PARSECOPY");
        return entry;
      }
    }, {
      "input": {
        "html/**": {
          "watch": ["html/**"]
        }
      },
      use: async function (entry, bundl) {
        console.log("NOT SORTED");
        return entry;
      }
    }]
  },
  task: {
    task1: {
      "order": 3,
      use: async function (prev, bundl) {
        console.log("TASK1");
      }
    }
  }
};


function waitTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Waited for");
    }, 100);
  });
}