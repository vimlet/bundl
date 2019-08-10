const { promisify } = require("util");
const meta = require("@vimlet/meta");
const parse = promisify(meta.parse);

meta.sandbox = {
  "hash": function (id) {
    if (this.data.hashParse && this.data.hashes && this.data.hashes[id]) {
      this.echo(this.data.hashes[id]);
    } else {
      ;
      this.echo(`<% hash('${id}') %>`);
    }
  }
};

module.exports = parse;