// const bundl = require("@vimlet/bundl");
module.exports = {
  "outputBase":"tests/unit/output/run",
  "inputBase":"tests/unit/resources/input",
  "clean": true,
  "log":false,
  "output": {
    "build.js": {
      "id": "build",
      "input": {
        "js/a.js": {
          use: [async function (entry, run) {
            entry.content += await run.fetch("node", {"args":["-v"]});  
            return entry;
          }]
        },
        "js/b.js": true,
        "js/c.js":true
      },
      use: async function (entry, run) {
        entry.content += await run.fetch("ping", {"args":["8.8.8.8"]});
        return entry;
      }
    }
  }
};