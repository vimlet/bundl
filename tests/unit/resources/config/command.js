module.exports = {
  "outputBase":"../output/command",
  "inputBase":"input",
  "clean": true,
  "output": {
    "build.{{hash}}.js?clean=false": {
      "id": "build",
      "input": {
        "js/a.js": {
          use: function (entry) {
            entry.content += "\nconsole.log(\"input use\");";
            return entry;
          }
        },
        "js/b.js": true
      },
      use: function (entry) {
        entry.content += "\nconsole.log(\"output use\");";
        return entry;
      } 
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
    }
  }
};