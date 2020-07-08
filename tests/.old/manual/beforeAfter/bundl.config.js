// const bundl = require("@vimlet/bundl");
module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": true,
  "output": {
    "build.js": {
      "id": "build",
      "input": {
        "js/**": {
          use: async function (entry, bundl){
            return entry;
          }}
      },
      use: async function (entry, bundl){ 
        return entry;
      }
    },
    "before.js": {
      before:"build",
      "input": {
        "js/**": true
      }
    },
    "after.js": {
      after:"build",
      "input": {
        "js/**": true
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