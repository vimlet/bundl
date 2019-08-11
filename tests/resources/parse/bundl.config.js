module.exports = {
  inputBase: "tests/resources/parse",
  outputBase: "tests/resources/parse",
  output: {
    "output/parse1.txt": {
      input: {
        "input/a.txt": {
          parse: true
        }
      }
    }
  }
}