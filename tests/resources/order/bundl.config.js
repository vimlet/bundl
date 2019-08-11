module.exports = {
  inputBase: "tests/resources/order",
  outputBase: "tests/resources/order",
  output: {

    // --- Output String ---
    "output/join1.txt": "input/**.txt",

    // ---  Output Object ---
    "output/join2.txt": {
      input: "input/**.txt",
      order: 2
    },
    "output/join3.txt": {
      input: {
        "input/**.txt": true
      },
      order: 3
    },
    "output/join4.txt": {
      input: [
        "input/a.txt",
        "input/b.txt",
        {
          "input/c.txt": true
        }
      ],
      order: 4
    },

    // --- Output Array ---
    "output/join5.txt": [
      "input/a.txt",
      "input/b.txt",
      "input/c.txt"
    ]
  }
}