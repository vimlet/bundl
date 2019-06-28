module.exports = {
  "outputBase":"test/output/test",
  "inputBase":"test/input",
  "clean": true,
  "log":false,
  // "watch": "test/input",
  "output": {
    "**": {
      "clean": false,
      "order": 0,
      "use":function (entry) {        
        // entry.fileName = entry.fileName.replace(".txt", ".css");
        // entry.content += "\nconsole.log(\"output use\");";
        return entry;
      },
      "input": {
        "copy/**": {
          use: [function (entry) {
            entry.content += "\nconsole.log(\"input use\");";
            return entry;
          },function (entry) {
            entry.content += "\nconsole.log(\"input use2\");";
            return entry;
          },async function (entry) {
            entry.fileName = entry.fileName.replace(".txt", ".css");
            entry.content += await waitTest();
            return entry;
          }]
        }
      }
    },
    "**": {
      "clean": false,
      "order": 0,
      "use":function (entry) {        
        // entry.fileName = entry.fileName.replace(".txt", ".css");
        // entry.content += "\nconsole.log(\"output use\");";
        return entry;
      },
      "input": {
        "copyClon/**": {
          use: [function (entry) {
            entry.content += "\nconsole.log(\"input use\");";
            return entry;
          },function (entry) {
            entry.content += "\nconsole.log(\"input use2\");";
            return entry;
          },async function (entry) {
            entry.fileName = entry.fileName.replace(".txt", ".css");
            entry.content += await waitTest();
            return entry;
          }]
        }
      }
    }
  }
};

function waitTest(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Waited for");
    }, 100);
  });
}