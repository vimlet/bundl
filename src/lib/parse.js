module.exports = function (config) {
  const meta = require("@vimlet/meta").instance();

  // if (config?.meta?.errorManaging) {
  //   meta.errorManaging = config.meta.errorManaging;
  // }

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

  return meta.parse;
};
