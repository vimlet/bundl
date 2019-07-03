module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": false,
  // "watch": "test/input",
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
        "js/b.js": true
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
    "index.html?clean=false&parse=true": "html/*.html",
    "index2.html?clean=false&parse=true&order=2": "html/*.html",
    "index0.html?clean=false&parse=true&order=0": "html/*.html",
    "index1.html?clean=false&parse=true&order=1": "html/*.html",
    "copy/**": {
      "clean": true,
      "order": 3,
      "input": {
        "copy/**": true
      }
    },
    "parse/1.txt": {
      "clean": true,
      "order": 0,
      "parse":true,
      "input": {
        "parse/**.vmt": {
          "watch":"parse/**"
        }
      }
    },
    "parseCopy/**": {
      "clean": true,
      "order": 0,
      "parse":true,
      "input": {
        "parseCopy/**.vmt": {
          "watch":"parseCopy/**"
        } 
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