module.exports = {
  "outputBase":"tests/unit/output/watch",
  "inputBase":"tests/unit/resources/watch",
  "watch": "tests/unit/resources/watch",
  "clean": true, 
  "log":false,
  "output": {
    "index.html?clean=false&parse=true": "html/*.html",
    "copy/**": {
      "clean": true,
      "order": 0,
      "input": {
        "copy/**": true
      }
    }
  }
};