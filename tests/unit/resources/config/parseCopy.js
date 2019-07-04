module.exports = {
    "outputBase":"tests/unit/output/parseCopy",
    "inputBase":"tests/unit/resources/input",
    "clean": true,
    "log":false,
    "output": {
      "**": {
        "clean": true,
        "order": 0,
        "parse":true,
        "input": {
          "parse/*.vmt": {"parse":true}
        }
      }
    }
  };