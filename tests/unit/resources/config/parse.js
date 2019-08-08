module.exports = {
    "outputBase":"tests/unit/output/parse",
    "inputBase":"tests/unit/resources/input",
    "clean": true,
    "log":false,
    "output": {
      "a.txt": {
        "order": 0,
        "parse":true,
        "input": {
          "parse/*.vmt": {"parse":true}
        }
      }
    }
  };