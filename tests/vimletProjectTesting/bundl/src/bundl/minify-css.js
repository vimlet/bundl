// https://github.com/jakubpawlowicz/clean-css
const CleanCSS = require("clean-css");

module.exports = function (options) {
  options = options || {};

  return async function (entry) {
    entry.content = Buffer.isBuffer(entry.content) ? entry.content.toString() : entry.content;
    var result = new CleanCSS(options).minify(entry.content);
    entry.content = result.styles;
    return entry;
  };
};