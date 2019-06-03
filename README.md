# metapack

## TODO 
[done] 1) clean per file
[done] 2) copy support
3) queyParam as key
4)array and string as default output value for input
[done] 5) baseDir changed to outputBase and inputBase
6) single output build
7) clean true && cleanDir false
8) Stage/Order

## Example config
module.exports = {
  "outputBase": "build",
  "watch": "src",
  "inputBase": "src",
  "clean": false,
  "output": {
    "bundle.{{hash}}.js": {
      "order": 0,
      "id": "bundle.js",
      "input": {
        ".js": true
      }      
    },
    "bundle.less": ["a/.css", "b/**.css"],
    "index.html?parse=true": "index.html"
  }
};