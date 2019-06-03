module.exports = {
  "outputBase":"test/output/test",
  "inputBase":"test/input",
  "output": {
    "build.{{hash}}.js": {
      "clean": true,
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
    "index.html": {
      "clean": true,
      "parse": true,
      "input": {
        "html/*.html": true
      }
    },
    "copy/**": {
      "clean": true,
      input: {
        "copy/**": true
      }
    }
  }
};