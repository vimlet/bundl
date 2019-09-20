module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": false,
  "watch": "input",
  "output": {
    "copy/**": [{
      id: "copy",
      "input": {
        "copy/**": {
          "watch": ["copy/**"]
        }
      },
      use: async function (entry, bundl) {
        console.log("COPY");
        return entry;
      }
    }],
    "parseCopy/**": [{
      "before": "copy",
      "input": {
        "parseCopy/**": {
          "watch": ["parseCopy/**"]
        }
      },
      use: async function (entry, bundl) {
        console.log("PARSECOPY");
        return entry;
      }
    }]
  },
  task: {
    task1: {
      "before": "copy",
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