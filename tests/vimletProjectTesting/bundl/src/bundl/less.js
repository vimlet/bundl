const path = require("path");

module.exports = async function (entry) {
  try {
    entry.content = Buffer.isBuffer(entry.content) ? entry.content.toString() : entry.content;
    entry.path = entry.path.replace(".less", ".css");
    entry.content = (await require("less").render(entry.content, {
      filename: path.join(entry.match)
    })).css;
  } catch (error) {
    console.log(error);
  }
  return entry;
};