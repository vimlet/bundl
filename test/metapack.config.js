var lessc = require("lessc");

module.exports = {
  "outputBase":"build/webapp",
  "inputBase":"src/webapp",
  "clean": false,
  "output": {
    "app/bundle.js": {
      "id": "bundle.js",
      "input": {
        "js/**.js": true
      }
    },
    "app/css/bundle.css": {
      "id": "bundle.css",
      "input": {
        "css/**.css": true
      }
    },
    "test/**": {
      "use":function (entry) {
        entry.filename = entry.filename.replace(".less", ".css");
        entry.content = lessc(entry.file);
        return entry;
      },
      "input": {
        "less/**.less": true
      }
    },
    "**": {
      "input": {
        "copy/**": true
      }
    }
  }
};