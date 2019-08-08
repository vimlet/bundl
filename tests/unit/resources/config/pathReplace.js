module.exports = {
    "outputBase":"tests/unit/output/pathReplace",
    "inputBase":"tests/unit/resources/input",
    "clean": true,
    "log": false,
    "output": {
        "input/**": {
          "input": {
            "html/**": {
              use: async function (entry) {
                entry.path = entry.path.replace(".html",".xml");
                return entry;
              }
            }
          }
        },
        "output/**": {
          "input": {
            "html/**": true
          },
          use: function (entry) {
            entry.path = entry.path.replace(".html",".xml");
            return entry;
          }
        },
      "**": {
        "input": {
          "html/**": {
            use: async function (entry) {
              entry.path = entry.path.replace(".html",".xml");
              return entry;
            }
          }
        }
      }
    }
  };
  