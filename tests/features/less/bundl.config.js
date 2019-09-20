const path = require("path");
var pathUrl = "C:/Users/jpere/Documents/NetbeansProjects/bundl/tests/features/less/input/less/main.less";
module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": false,
  "log": true,
  "output": {
    "app/bundle.js": {
      order: 1,
      "id": "bundle.js",
      "input": {
        "js/**.js": true
      }
    },
    "app/css/bundle.css": {
      order: 1,
      "id": "bundle.css",
      "input": {
        "css/**.css": true
      }
    },
    "**": [{
        order: 1,
        "input": {
          "less/**.less": {
            "use": async function (entry) {
              try {
                entry.path = entry.path.replace(".less", ".css");
                entry.content = (await require("less").render(entry.content.toString("utf8"), {
                  filename: path.resolve(path.join("input", entry.path)),
                }));
              } catch (error) {
                console.log(error);
              }
              return entry;
            }
          }
        }
      },
      {
        order: 1,
        "input": {
          "copy/**": true
        }
      }
    ]
  },
  task: {
    cli: {
      order: 2,
      use: async function (prev, bundl) {
        // npx eon-cli build
        //   bundl.run.exec('npx', {
        //     args: ["eon-cli", "build"]
        // });
      }
    }
  }
};