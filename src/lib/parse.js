const meta = require("@vimlet/meta").instance();

meta.sandbox = {
  hash(id) {
    return this.data.__meta?.[id]?.hash;
  },
  file(id) {
    this.echo(this.data.__meta?.[id]?.file || "");
  },
  filename(id) {
    this.echo(this.data.__meta?.[id]?.filename || "");
  }
};

module.exports = meta.parse;
