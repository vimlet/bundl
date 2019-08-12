module.exports = {
    "outputBase":"tests/unit/output/beforeAfter",
    "inputBase":"tests/unit",
    "clean": true,
    "log":false,
    "output": {
      "unsorted/**": [{
          "input": {
              "output/beforeAfter/**": {
                  "use": function (entry) {
                      entry.path = entry.path.replace(".txt", ".css");
                      return entry;
                  }
              }
          }
      }],
      "all/**": [{
          "order": 0,
          "id": "0",
          "input": "output/beforeAfter/before/**"
      }],
      "before/**": {
          "before": "0",
          "input": "resources/input/sort/**"
      },
      "after/**": {
          "after": "0",
          "input": "output/beforeAfter/all/**"
      }
  }
  };