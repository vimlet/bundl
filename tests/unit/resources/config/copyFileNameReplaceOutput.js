module.exports = {
  "outputBase":"tests/unit/output/copyFileNameReplaceOutput",
  "inputBase":"tests/unit/resources/input",
  "clean": true,
  "log":false,
  "output": {
    "copy/**": {
      "clean": true,
      "order": 0,
      "fileNameReplace":[".txt", ".css"],
      "input": {        
        "copy/**": true
      }
    }
  }
};