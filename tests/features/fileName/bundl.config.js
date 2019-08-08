module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": false,
  "output": {
    "build.js": {
      "id": "build",
      "input": {
        "js/a.js": {
          use: function (entry) { 
            console.log("Input");                
            console.log(entry);
            return entry;
          }
        },
        "js/b.js": true,
        "js/c.js":true
      },
      use: function (entry) {
        console.log("Output");   
        console.log(entry);
        return entry;
      }
    }, 
    "copy/**":{
      "input":{
        "html/**": {
          use: function (entry) { 
            console.log("Copy input");                
            console.log(entry);
            return entry;
          }
        }
      },
      use:function (entry) {
        console.log("Copy output");   
        console.log(entry);
        return entry;
      }
    }
  }
};
