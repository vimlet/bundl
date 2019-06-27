module.exports = {
  "outputBase":"tests/unit/output/extension",
  "inputBase":"tests/unit/resources/input",
  "clean": true,
  "log":false,
  "output": {
    "copy/**": {
      "clean": true,
      "order": 0,
      "use":function (entry) {
        entry.fileName = entry.fileName.replace(".txt", ".css");
        entry.content += "\nconsole.log(\"output use\");";
        return entry;
      },
      "input": {
        "copy/**": true
      }
    }
  }
};