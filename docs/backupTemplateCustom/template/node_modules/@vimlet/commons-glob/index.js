var fs = require("fs");
var path = require("path");

class Glob {
  match(paths, patterns, options) {
    var self = this;
    var options = options || {};
    options.preservePathOrder = "preservePathOrder" in options ? options.preservePathOrder : false;
    var matches = [];
    // Support single path/pattern string
    paths = typeof paths === "string" ? [paths] : paths;
    patterns = typeof patterns === "string" ? [patterns] : patterns;
    if (!patterns || patterns.length === 0) {
      return matches; 
    }
    // Store filtered patterns in options 
    var filtered = this.filterPatterns(patterns);
    options.patterns = filtered[0];
    options.negatePatterns = filtered[1];

    // Match against paths or patterns to preserve order respectively
    if (options.preservePathOrder) {
      paths.forEach(function (p) {
        var foundPattern = self.isMatch(p, null, options);
        if (foundPattern) {
          matches.push({
            match: p,
            pattern: foundPattern
          });
        }
      });
    } else {
      // Single pattern should have the same performance
      var singlePatternOptions = {
        negatePatterns: options.negatePatterns
      };
      options.patterns.forEach(function (pattern) {
        singlePatternOptions.patterns = [pattern];
        paths.forEach(function (p) {
          var foundPattern = self.isMatch(p, null, singlePatternOptions);
          if (foundPattern) {
            matches.push({
              match: p,
              pattern: foundPattern
            });
          }
        });
      });
    }

    return matches;
  }

  isMatch(s, patterns, options) {
    options = options || {};
    options.caseSensitive = options.caseSensitive ? "" : "i";

    patterns = typeof patterns === "string" ? [patterns] : patterns;

    // Use stored filtered patterns to avoid filtering more than once
    var negatePatterns;
    if ("negatePatterns" in options) {
      patterns = options.patterns;
      negatePatterns = options.negatePatterns;
    } else {
      var filtered = this.filterPatterns(patterns);
      patterns = filtered[0];
      negatePatterns = filtered[1];
    }

    // Check if match with pattern
    for (var i = 0; i < patterns.length; i++) {
      if (s.match(new RegExp("^" + this.patternToRegex(patterns[i]) + "$"), options.caseSensitive)) {
        // Check if match with negate pattern
        for (var j = 0; j < negatePatterns.length; j++) {
          if (s.match(new RegExp("^" + this.patternToRegex(negatePatterns[j]) + "$"), options.caseSensitive)) {
            return null;
          }
        }
        return patterns[i];
      }
    }
    return null;
  }

  isPattern(s) {
    return s.includes("*") || s.includes("!");
  }

  escapeRegExp(s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  }

  patternToRegex(s) {
    s = this.escapeRegExp(s);
    s = s.replace(/\\\*\\\*/g, ".*");
    s = s.replace(/[^\.]\*/g, "[^/]*");
    return s;
  }

  filterPatterns(patterns) {
    var negatePatterns = [];
    var pattern;
    for (var i = patterns.length - 1; i >= 0; i--) {
      pattern = patterns[i];
      if (pattern.startsWith("!")) {
        negatePatterns.push(patterns.pop(i).substr(1));
      }
    }
    return [patterns, negatePatterns];
  }

  files(patterns, options, callback) {
    var self = this;
    if (!callback) {
      return new Promise(function (resolve, reject) {
        self.files(patterns, options, function (error, data) {
          error ? reject(error) : resolve(data);
        });
      });
    }

    options = options || {};
    options.path = options.path || process.cwd();
    self.filewalker(options.path, options, function (error, files) {
      files = files.map(function (entry) {
        return path.normalize(path.relative(options.path, entry)).replace(/\\/g, "/");
      });
      var matchesWithFile = self.match(files, patterns, options).map(function (entry) {
        entry.file = path.normalize(path.join(options.path, entry.match)).replace(/\\/g, "/");
        return entry;
      });
      callback(error, matchesWithFile);
    });
  }

  filewalker(s, options, callback) {
    var self = this;
    if (!callback) {
      return new Promise(function (resolve, reject) {
        self.filewalker(s, options, function (error, data) {
          error ? reject(error) : resolve(data);
        });
      });
    }

    var results = [];
    fs.readdir(s, function (error, list) {
      if (error) {
        return callback(error);
      }
      var pending = list.length;
      if (!pending) {
        return callback(null, results);
      }
      list.forEach(function (file) {
        file = path.normalize(path.join(s, file)).replace(/\\/g, "/");
        fs.stat(file, function (error, stat) {
          if (stat && stat.isDirectory()) {
            if(options.includeFolders){ 
              results.push(file);
            }
            self.filewalker(file, options, function (error, res) {
              results = results.concat(res);
              if (!--pending) {
                callback(null, results);
              }
            });
          } else {
            results.push(file);
            if (!--pending) {
              callback(null, results);
            }
          }
        });
      });
    });
  }
}

module.exports = new Glob();