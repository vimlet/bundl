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
    watch: {
      watch:"copy/**",
      use: async function (previousUse, bundl) {
        console.log("Should be called watch");     
      }
    },
    order: {
      order:1,
      use: async function (previousUse, bundl) {
        console.log("Should be called order");     
      }
    }, 
    runOnBuild: {
      runOnBuild:true,
      use: async function (previousUse, bundl) {
        console.log("Should be called runOnBuild");     
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