module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": false,
  // "watch": "test/input",
  "output": {
    "parse/**": {
      "clean": true,
      "order": 0,
      "parse":true,
      "input": {
        "parseCopy/**.vmt": {
          "parse":true,
          "watch":"parse/**"
        },
        "parse2/**.vmt": {
          "watch":"parse/**"
        }
      }
    }
  }
};

