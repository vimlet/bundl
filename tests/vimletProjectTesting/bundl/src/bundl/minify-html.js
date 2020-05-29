// https://github.com/kangax/html-minifier
// https://github.com/terser/terser
const minify = require("html-minifier").minify;
const Terser = require("terser");

module.exports = function (options) {
    options = options || {
        removeComments: true,
        minifyJS: function (text, inline) {
            var result = Terser.minify(text, {});
            if (result.error) {
                return text;
            } else {
                return result.code;
            }
        },
        minifyCSS: true,
        collapseWhitespace: true,
        conservativeCollapse: true
    };

    return async function (entry) {
        entry.content = Buffer.isBuffer(entry.content) ? entry.content.toString() : entry.content;
        var result = minify(entry.content, options);
        entry.content = result;
        return entry;
    };
};