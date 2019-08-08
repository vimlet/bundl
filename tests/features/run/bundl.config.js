const bundl = require("@vimlet/bundl");
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
          use: [async function (entry, run) {
            entry.content += "\nconsole.log(\"input use\");";
            entry.content += await waitTest();      
            var result = await run.fetch("ping", {"args":["8.8.8.8"]});        
            console.log("Input result:::",result);
            return entry;
          }]
        },
        "js/b.js": true,
        "js/c.js":true
      },
      use: [async function (entry) {
        entry.content += "\nconsole.log(\"output use2\");";
        var result = await bundl.run.fetch("ping", {"args":["8.8.8.8"]});        
        console.log("Output bundl result:::",result);
        return entry;
      }, async function (entry, run) {
        entry.content += await waitTest();        
        var result = await run.fetch("ping", {"args":["8.8.8.8"]});        
        console.log("Output result:::",result);
        return entry;
      }]
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