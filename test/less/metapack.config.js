module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  // "watch": "test/input",
  "output": {
    "build.{{hash}}.js?clean=false": {
      "id": "build",
      "input": {
        "js/a.js": {
          use: [async function (entry) {
            entry.content += "\nconsole.log(\"input use\");";
            return entry;
          }]
        }
      },
      use: [async function (entry) {
        entry.content += "\nconsole.log(\"output use\");";
        entry.content += await waitTest();
        return entry;
      }]
    },
    "copy2/**": {
      "clean": true,
      "order": 0,
      "use": async function (entry) {
        entry.fileName = entry.fileName.replace(".less", ".css");
        entry.content = await doLess(entry.content);
        return entry;
      },
      "input": {
        "copy/**.less": true
      }
    }
  }
};

const less = require("less");
function doLess(content) {
  return new Promise((resolve, reject) => {
    less.render(content.toString("utf8"))
      .then(function (output) {
        resolve(output.css);
      }).catch(function (error) {        
        reject(error);
      });
  });
}

function waitTest(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Waited for");
    }, 2000);
  });
}