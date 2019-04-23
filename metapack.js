module.exports = {
  "output": {
    "test/build.js" : {
      "input": {
        "test/input/a.js": {
          use: function(entry){
            entry.content += "\nconsole.log(\"input use\");";
            return entry;
          }
        },
        "test/input/b.js": true
      },
      use: function(entry){
        entry.content += "\nconsole.log(\"output use\");";
        return entry;
      }
    }
  }
};