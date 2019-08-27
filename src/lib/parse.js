const {
  promisify
} = require("util");
const meta = require("@vimlet/meta");
const parse = promisify(meta.parse);

meta.sandbox = {
  "hash": function (id) {        
    if (this.data.hashes && this.data.hashes[id]) {
      this.echo(this.data.hashes[id]);
    } else {
      this.echo(`<% hash('${id}') %>`);
    }
  },
  "file": function (id) {
    if (this.data.hashes && this.data.hashes[id]) {
      this.echo(this.data.hashes[id]);
    } else {
      this.echo(`<% file('${id}') %>`);
    }
  },
  "filename": function (id) {
    if (this.data.hashes && this.data.hashes[id]) {
      this.echo(this.data.hashes[id]);
    } else {
      this.echo(`<% filename('${id}') %>`);
    }
  }
};

module.exports = parse;