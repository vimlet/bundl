module.exports = {
  "outputBase":"test/output/test",
  "inputBase":"test/input",
  "clean": true,
  // "watch": "test/input",
  "output": {
    "build.{{hash}}.js?clean=false": {
      "id": "build",
      "input": {
        "js/a.js": {
          use: [function (entry) {
            entry.content += "\nconsole.log(\"input use\");";
            return entry;
          },function (entry) {
            entry.content += "\nconsole.log(\"input use2\");";
            return entry;
          }]
        },
        "js/b.js": true
      },
      use: [function (entry) {
        entry.content += "\nconsole.log(\"output use\");";
        return entry;
      },function (entry) {
        entry.content += "\nconsole.log(\"output use2\");";
        return entry;
      }]
    },
    "index.html?clean=false&parse=true": "html/*.html",
    "index2.html?clean=false&parse=true&order=2": "html/*.html",
    "index0.html?clean=false&parse=true&order=0": "html/*.html",
    "index1.html?clean=false&parse=true&order=1": "html/*.html",
    "copy/**": {
      "clean": true,
      "order": 0,
      "input": {
        "copy/**": true
      }
    },
    "copy2/**": {
      "clean": true,
      "order": 0,
      "use":function (entry) {
        entry.fileName = entry.fileName.replace(".txt", ".css");
        entry.content += "\nconsole.log(\"output use\");";
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
          }]
        }
      }
    }
  }
};