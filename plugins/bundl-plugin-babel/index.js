const { transformAsync } = require('@babel/core')

module.exports = async (entry, opts) => {
  entry.content = (await transformAsync(entry.content, opts)).code
  return entry
}