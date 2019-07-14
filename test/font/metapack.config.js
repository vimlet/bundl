module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  // "watch": "test/input",
  "output": {
    "**": {
      "input": {
        "**.less": {
          "use": async function (entry) {
            try {
              entry.fileName = entry.fileName.replace(".less", ".css");
              entry.content = (await require("less").render(entry.content.toString("utf8"), {
                filename: require("path").resolve(entry.file),
              })).css;
            } catch (error) {
              console.log(error);
            }
            return entry;
          },
          order:1
        },
        "font/**":{
          order:0
        },
        "!less/**":true,
        "!font/vimlet/**":true
      }
    }
  }
};