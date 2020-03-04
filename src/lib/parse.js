const {
  promisify
} = require("util");
const meta = require("@vimlet/meta");
const parse = promisify(meta.parse);

meta.sandbox = {
  "hash": function (id) {          
    if (this.data.__meta && this.data.__meta[id] && this.data.__meta[id].hash) {
      return this.data.__meta[id].hash;
    }
  },
  "file": function (id) {
    if (this.data.__meta && this.data.__meta[id] && this.data.__meta[id].file) {
      this.echo(this.data.__meta[id].file);
    }
  },
  "filename": function (id) {
    if (this.data.__meta && this.data.__meta[id] && this.data.__meta[id].filename) {
      this.echo(this.data.__meta[id].filename);
    }
  }
};

module.exports = parse;