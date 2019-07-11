module.exports = {
    "outputBase":"tests/unit/output/transform",
    "inputBase":"tests/unit/resources/input",
    "clean": true,
    "log":false,
    "output": {
      "a.txt": {
        "clean": true,
        "order": 0,
        "input": {
          "transform/**": true
        }
      }
    }
  };