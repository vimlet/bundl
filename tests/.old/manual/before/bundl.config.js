module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": true,
  "output": {
    "buildA.js": {
      id:"a",
      use: async function (entry) {
        await waitTest(3);
        return entry;
      },
      "input": {
        "js/a.js": true
      },
      "before": "b c"
    },
    "buildB.js": {
      id: "b",
      use: async function (entry) {
        await waitTest(2);
        return entry;
      },
      "input": {
        "js/b.js": true
      }
    },
    "buildC.js": {
      id: "c",
      use: async function (entry) {
        await waitTest(0);
        return entry;
      },
      "input": {
        "js/c.js": true
      }
    },
    "buildD.js": {
      use: async function (entry) {
        console.log("Expected D-A-C-B");
        
        // await waitTest();
        return entry;
      },
      "input": {
        "js/d.js": true
      },
      before: "b"
    }
  }
};



function waitTest(amount) {
  return new Promise((resolve, reject) => {
      amount = amount || 1;
      setTimeout(() => {
          resolve("Waited for");
      }, (1000 * amount));
  });
}