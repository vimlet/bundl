module.exports = {
  "outputBase":"tests/unit/output/copyFileNameReplaceInput",
  "inputBase":"tests/unit/resources/input",
  "clean": true,
  "log":false,
  "output": {
    "copy/**": {
      "clean": true,
      "order": 0,
      "input": {        
        "copy/**": {"fileNameReplace":[".txt", ".css"]}
      }
    }
  }
};