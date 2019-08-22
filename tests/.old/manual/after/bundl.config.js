module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": true,
  "output": {
    "buildA.js": {
      id:"a",
      use:async function(entry){
        await waitTest(3);
        return entry;
      },
      "input": {
        "js/a.js": true
      }
    },
    "buildB.js": {
      use:async function(entry){
        await waitTest(0);
        return entry;
      },
      "input": {
        "js/b.js": true
      },
      "after":"a"
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