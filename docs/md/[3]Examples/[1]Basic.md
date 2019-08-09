# Basic Configuration Example

Here is example of a `bundl.config.js` file, making use of some options: 

```[javascript]
module.exports = {
  "outputBase": "build/webapp",
  "inputBase": "src/webapp",
  "clean": true,
  "log": true,
  "output": {
    "app/bundle.js": {
      "id": "bundle-js",
      "order": 0,
      "input": {
        "js/**.js": true
      }
    },
    "app/css/bundle.css": {
      "id": "bundle-css",
      "order": 0,
      "input": {
        "css/**.css": true
      }
    },
    "**": [
      {
        "order": 0,
        "input": {
          "less/**.less": {
            "use": async function(entry) {
              try {
                var file = entry.path;
                entry.path = entry.path.replace(".less", ".css");
                entry.content = (await require("less").render(entry.content.toString("utf8"), {
                  filename: require("path").resolve(file),
                })).css;
              } catch(error) {
                console.log(error);
              }
              return entry;
            }
          }
        }
      },
      {
        "input": "copy/**"
      }
    ]
  }
};
```
