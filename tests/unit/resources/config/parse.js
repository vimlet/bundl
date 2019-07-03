module.exports = {
  "outputBase":"tests/unit/output/parse",
  "inputBase":"tests/unit/resources/input",
  "clean": true,
  "log":false,
  "output": {
    "a.txt": {
      "clean": true,
      "order": 0,
      "parse":true,
      "input": {
        "parse/*.vmt": true
      }
    }
  }
};