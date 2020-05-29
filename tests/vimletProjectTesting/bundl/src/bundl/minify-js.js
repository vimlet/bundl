// https://github.com/terser/terser
const Terser = require("terser");

module.exports = function (options) {
  options = options || {};

  return async function (entry) {
    entry.content = Buffer.isBuffer(entry.content) ? entry.content.toString() : entry.content;
    var result = await Terser.minify(entry.content.toString(), options);
    if(!result.error) {
      entry.content = result.code;
    }
    return entry;
  };
};