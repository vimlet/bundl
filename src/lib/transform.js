const promisify = require("util").promisify;
const meta = require("@vimlet/meta");
const parse = promisify(meta.parse);

meta.sandbox = {
  "hash": function (id) {
    if (this.data.hashParse && this.data.hashes && this.data.hashes[id]) {
      this.echo(this.data.hashes[id]);
    } else {
      ;
      this.echo(`<% hash('${id}') %>`)
    }
  }
};

module.exports.processInputJoin = function (files) {
  return files.reduce((total, current, index, array) => {
    return total + current.content.toString() + (index < (array.length - 1) ? "\n" : "");
  }, "");
};

module.exports.processInputUse = function (inputsObject, files) {
  files = files.map(file => {
    if (inputsObject[file.match] instanceof Object && inputsObject[file.match].use) {
      return inputsObject[file.match].use(file);
    }
    return file;
  });
  return files;
};

module.exports.processOutputUse = function (outputEntry, outputPath, content) {
  if (outputEntry.use) {
    content = outputEntry.use({
      file: outputPath,
      content: content
    }).content;
  }
  return content;
};

module.exports.processOutputMeta = async function (outputEntry, hashes, content) {
  if (outputEntry.parse) {
    content = await parse(content, {
      data: {
        hashes: hashes
      }
    });
  }
  return content;
};

module.exports.processLateMetaHash = async function(hashes, result) {
  if (result.parse) {
    result.content = await parse(result.content, {
      data: {
        hashParse: true,
        hashes: hashes
      }
    });
  }
  return result;
};
