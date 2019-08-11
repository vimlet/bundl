module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": false,
  "output": {
    "build.{{hash}}.js?clean=false": {
      "id": "build",
      "input": {
        "js/a.js": {
          use: [async function (entry) {
            entry.content += "\nconsole.log(\"input use\");";
            entry.content += await waitTest();
            return entry;
          }]
        },
        "js/b.js": true,
        "js/c.js":true
      },
      use: [function (entry) {
        entry.content += "\nconsole.log(\"output use\");";
        return entry;
      }, function (entry) {
        entry.content += "\nconsole.log(\"output use2\");";
        return entry;
      }, async function (entry) {
        entry.content += await waitTest();
        return entry;
      }]
    },
    "build2.js": {
      "input": {
        "js/a.js": true,
        "js/b.js": true,
        "js/c.js":true
      }
    },
    "build3.js": {
      "input": {
        "js/**.js": true
      }
    },
    "build4.js": {
      "input": "js/**.js"
    },
    "build5.js": {
      "input": ["js/**.js"]
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