var fs = require("fs");
var path = require("path");
var promisify = require("util").promisify;
var readFile = promisify(fs.readFile);
var glob = require("@vimlet/commons-glob");

function readFiles(paths) {
  // Create a promise array of readFile
  var files = paths.map(function (p) {
    return readFile(p);
  });
  return Promise.all(files);
};

module.exports.processOutput = function (config) {
  for (var outputPath in config.output) {
    var outputEntry = config.output[outputPath];
    var outputParent = path.dirname(outputPath);

    glob.files(Object.keys(outputEntry.input))
      .then(function (paths) {
        // Pick only file paths from the glob files result
        paths = paths.map(function (entry) {
          return entry.file;
        });

        readFiles(paths).then(function (content) {
          // Join files content with new lines when needed
          content = content.reduce(function (total, current, index) {
            return total + current.toString() + (index < (content.length - 1) ? "\n" : "");
          }, "");

          // Write content to ouput file
          if (!fs.existsSync(outputParent)) {
            fs.mkdirSync(outputParent);
          }
          fs.writeFileSync(outputPath, content);

        }).catch(function (error) {
          console.log(error);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

