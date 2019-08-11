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
            // console.log("INPUT TRANSFORM");
            // console.log(entry);
            return entry;
          }]
        },
        "js/b.js": true,
        "js/c.js": true
      },
      use: [function (entry) {
        // console.log("OUTPUT TRANSFORM");
        // console.log(entry);
        return entry;
      }]
    },
    "copy/**": {
      "input": {
        "html/**": {
          use: async function (entry) {
            // console.log("INPUT COPY");
            // console.log(entry);
            // entry.path = entry.path.replace(".html",".xml");
            return entry;
          }
        }
      },
      use: function (entry) {
        console.log("OUTPUT COPY");
        console.log(entry);
        // entry.path = entry.path.replace(".html",".xml");
        return entry;
      }
    },
    "**": {
      "input": {
        "html/**": {
          use: async function (entry) {
            // console.log("INPUT COPY ROOT");
            // console.log(entry);
            // entry.path = entry.path.replace(".html",".sml");
            return entry;
          }
        }
      },
      use: function (entry) {
        // console.log("OUTPUT COPY");
        // console.log(entry);
        // entry.path = entry.path.replace(".html",".xml");
        return entry;
      }
    }
  }
};
