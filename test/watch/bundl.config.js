module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": false,
  "watch": "input",
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
      "order": 3,
      "input": {
        "copy/**": {
          "watch": ["copy/**"]
        }
      }
    },
    "parse/1.txt": {
      "order": 0,
      "parse": true,
      "input": {
        "parse/**.vmt": {
          "parse": true,
          "watch": "parse/**"
        }
      }
    },
    "parseCopy/**": {
      "order": 0,
      "parse": true,
      "input": {
        "parseCopy/**.vmt": {
          "parse": true,
          "watch": "parseCopy/**"
        }
      }
    },
    "string/**": "this.js",
    "stringArray/**": ["array/**", "js/a.js", "js/b.js"]
  }
};


function waitTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Waited for");
    }, 100);
  });
}