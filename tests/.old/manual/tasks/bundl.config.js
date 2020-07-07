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
    }
  },
  tasks:{    
    auto: {
      after: "build",
      use: async function (previousUse, bundl) {
        console.log("Should be called auto");     
      }
    },    
    notTriggered: {
      use: async function (previousUse, bundl) {
        console.log("Should not be called");        
      }
    }, 
    secondary: {
      watch:"copy/**",
      use: async function (previousUse, bundl) {
        console.log("Should be called secondary");     
      }
    }, 
  }
};


function waitTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Waited for");
    }, 100);
  });
}