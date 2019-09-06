module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": false,
  "watch": "input",
  "output": {
    "copy/**": {
      "order": 3,
      "input": {
        "copy/**": {
          "watch": ["copy/**"]
        }
      }
    },
    "parse/1.txt": {
      id:"parse",
      "order": 0,
      "parse": true,
      "input": {
        "parse/**.vmt": {
          "parse": true,
          "watch": "parse/**"
        }
      }
    },
    "parseCopy/**": {
      after:"parse",
      "input": {
        "parseCopy/**": {
          "watch": ["copy/**"]
        }
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