var watch = require('glob-watcher');
var path = require("path");
var io = require("@vimlet/commons-io");
var fs = require("fs-extra");

exports.watch = function (include, output, options) {  
  var meta = require("../index.js");
  options = options || {};
  options.clean = false;
  console.log("Watching:", include);
  var watcher = watch(include, {
    events: ['add', 'change', 'unlink', 'addDir', 'unlinkDir']
  });
  watcher.on('change', async function (filePath, stat) {    
    var excluded = await io.isInPattern(filePath, options.exclude, null);    
    if (!excluded) {
      // Relative output is where the template will be saved after parsed
      var relativeOutput = await io.getRelativeOutput(include, output, filePath, null);
      // Parse modified file      
      meta.parseTemplateGlobAndWrite(filePath, relativeOutput, options);
      console.log("Changed --> ", filePath + " => " + path.join(relativeOutput, path.basename(filePath, ".vmt")));
    }
  });
  watcher.on('add', async function (filePath, stat) {
    var excluded = await io.isInPattern(filePath, options.exclude, null);
    if (!excluded) {
      // Relative output is where the template will be saved after parsed
      var relativeOutput = await io.getRelativeOutput(include, output, filePath, null);
      // Parse modified file
      meta.parseTemplateGlobAndWrite(filePath, relativeOutput, options);
      console.log("Added --> ", filePath + " => " + path.join(relativeOutput, path.basename(filePath, ".vmt")));
    }
  });
  watcher.on('unlink', async function (filePath, stat) {
    var excluded = await io.isInPattern(filePath, options.exclude, null);
    if (!excluded) {
      // Relative output is where the template will be saved after parsed
      var relativeOutput = await io.getRelativeOutput(include, output, filePath, {
        deleted: true
      });
      var parsedPath = path.join(relativeOutput, path.basename(filePath, ".vmt"));
      if (fs.existsSync(parsedPath)) {
        fs.unlinkSync(parsedPath);
        console.log("Removed --> ", parsedPath);
      }
    }
  });
  watcher.on('addDir', async function (filePath, stat) {
    var relativeOutput = await io.getRelativeOutput(include, output, filePath, null);
    fs.mkdirs(path.join(relativeOutput, path.basename(filePath)), function () {
      console.log("Folder created --> ", filePath, "=>", path.join(relativeOutput, path.basename(filePath)));
    });
  });
  watcher.on('unlinkDir', async function (filePath, stat) {
    var relativeOutput = await io.getRelativeOutput(include, output, filePath, {
      deleted: true
    });
    fs.remove(path.join(relativeOutput, path.basename(filePath)), function () {
      console.log("Folder removed --> ", path.join(relativeOutput, path.basename(filePath)));
    });
  });
  watcher.on('error', function (error) {
    if (process.platform === 'win32' && error.code === 'EPERM') {
      // Deleting an empty folder doesn't fire on windows
    } else {
      broadcastErr(error);
    }
  });
  return watcher;
};

exports.watchDirectory = function (include, exclude, callback) {
  var meta = require("../index.js");
  var watcher = watch(include, {
    events: ['add', 'change', 'unlink', 'unlinkDir']
  });
  watcher.on('change', async function (filePath, stat) {
    var excluded = await io.isInPattern(filePath, exclude, null);
    if (!excluded) {
      console.log("Changed --> ", filePath);
      callback();
    }
  });
  watcher.on('add', async function (filePath, stat) {
    var excluded = await io.isInPattern(filePath, exclude, null);
    if (!excluded) {
      console.log("Added --> ", filePath);
      callback();
    }
  });
  watcher.on('unlink', async function (filePath, stat) {
    var excluded = await io.isInPattern(filePath, exclude, null);
    if (!excluded) {
      console.log("Removed --> ", filePath);
      callback();
    }
  });
  watcher.on('unlinkDir', async function (filePath, stat) {
    var excluded = await io.isInPattern(filePath, exclude, null);
    if (!excluded) {
      console.log("Directory removed --> ", filePath);
      callback();
    } 
  });
  watcher.on('error', function (error) {
    if (process.platform === 'win32' && error.code === 'EPERM') {
      // Deleting an empty folder doesn't fire on windows
    } else {
      broadcastErr(error);
    }
  });
  return watcher;
};
