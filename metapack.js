module.exports = {
  "basedir": "test/output/test",
  // "watch": "test/input",
  "output": {
    "build.{{hash}}.js": {
      "id": "build",
      "clean": true,
      "input": {
        "test/input/js/a.js": {
          use: function (entry) {
            entry.content += "\nconsole.log(\"input use\");";
            return entry;
          }
        },
        "test/input/js/b.js": true
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
        "test/input/html/*.html": true
      }
    },
    "copy/**": {
      "clean": true,
      input: {
        "test/input/copy/**": true
      }
    }
  }
};