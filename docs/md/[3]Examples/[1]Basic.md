# Basic Configuration Example

Here is example of a `bundl.config.js` file, making use of some options: 

```[javascript]
module.exports = {
  output: {
    "dist/bundle.js": {
      id: "bundle-js",
      input: "src/js/**.js"      
    },
    "dist/bundle.css": {
      id: "bundle-css",
      input: "src/css/**.css"
    },
    "dist/**": {
      input: {
        "src/copy/**": {
          parse: true
        }
      }
    }
  }
};
```
