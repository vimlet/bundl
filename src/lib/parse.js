const {
  promisify
} = require("util");
const meta = require("@vimlet/meta");
const parse = promisify(meta.parse);

meta.sandbox = {
  "hash": function (id) {          
    if (this.data.meta && this.data.meta[id] && this.data.meta[id].hash) {
      this.echo(this.data.meta[id].hash);
    }
  },
  "file": function (id) {
    if (this.data.meta && this.data.meta[id] && this.data.meta[id].file) {
      this.echo(this.data.meta[id].file);
    }
  },
  "filename": function (id) {
    if (this.data.meta && this.data.meta[id] && this.data.meta[id].filename) {
      this.echo(this.data.meta[id].filename);
    }
  }
};

module.exports = parse;