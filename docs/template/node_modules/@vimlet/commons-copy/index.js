#!/usr/bin/env node

var io = require("@vimlet/commons-io");
var path = require("path");
var glob = require("glob");
var fs = require("fs-extra");
var cli = require("@vimlet/cli").instantiate();
var watch = require("./lib/watch");
var deasync = require("deasync");



module.exports.copy = async function (include, output, options, callback) {
    options = options || {};
    if (options.clean) {        
        await io.deleteFolderRecursive(output);                    
    }
    var totalFiles = 0;
    var rootsArray = await io.getFiles(include, options);
    rootsArray.forEach(function (rootObject) {
        totalFiles += rootObject.files.length;
    });
    if (totalFiles === 0) {
        if (callback) {
            callback();
        }
    } else {
        rootsArray.forEach(function (rootObject) {
            rootObject.files.forEach(function (relativePath) {
                fs.copy(path.join(rootObject.root, relativePath), path.join(output, relativePath), function (err) {
                    totalFiles--;
                    if (totalFiles == 0) {
                        if (callback) {
                            callback();
                        }
                    }
                });
            });
        });
    }
};

module.exports.copySync = function (include, output, options) {
    var done = false;
    var data;
    module.exports.copy(include, output, options, function cb(res) {
        data = res;
        done = true;
    });
    deasync.loopWhile(function () {
        return !done;
    });
};


module.exports.watch = function (include, output, options) {
    module.exports.copy(include, output, options);
    watch.watch(include, output, options);
    if (options && options.watchdirectory) {
        watch.watchDirectory(options.watchdirectory, options.exclude, function () {
            module.exports.copy(include, output, options);
        });
    }
};

// Command mode
if (!module.parent) {

    function list(value) {
        var result = value.split(",");
        for (var i = 0; i < result.length; i++) {
            result[i] = result[i].trim();
        }
        return result;
    }

    cli
        .value("-i", "--include", "Include patterns", list)
        .value("-e", "--exclude", "Exclude patterns", list)
        .value("-o", "--output", "Output path")
        .flag("-c", "--clean", "Clean output directory")
        .value("-w", "--watch", "Keeps watching for changes")
        .flag("-h", "--help", "Shows help")
        .parse(process.argv);

    var cwd = process.cwd();

    var include = cli.result.include || path.join(cwd, "**/*.*");
    var exclude = cli.result.exclude || "**node_modules**";
    var output = cli.result.output || cwd;
    var clean = cli.result.clean || false;


    var options = {};
    options.exclude = exclude;
    options.clean = clean;

    if (cli.result.help) {
        cli.printHelp();
    } else {
        if (cli.result.watch) {
            if (typeof (cli.result.watch) != "boolean") {
                options.watchdirectory = cli.result.watch;
            }
            module.exports.watch(include, output, options);
        } else {
            module.exports.copySync(include, output, options);
        }
    }

}