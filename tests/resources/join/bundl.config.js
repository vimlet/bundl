module.exports = {
  inputBase: "tests/resources/join",
  outputBase: "tests/resources/join",
  output: {

    // --- Output String ---
    "output/join1.txt": "input/**.txt",

    // ---  Output Object ---
    "output/join2.txt": {
      input: "input/**.txt"
    },
    "output/join3.txt": {
      input: {
        "input/**.txt": true
      }
    },
    "output/join4.txt": {
      input: [
        "input/a.txt",
        "input/b.txt",
        {
          "input/c.txt": true
        }
      ]
    },

    // --- Output Array ---
    "output/join5.txt": [
      "input/a.txt",
      "input/b.txt",
      "input/c.txt"
    ]
  }
}