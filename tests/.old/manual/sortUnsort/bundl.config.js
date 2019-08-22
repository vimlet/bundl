module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": true,
  "log": true,
  "output": {
    "buildA.js": {
      order:1,
      use:async function(entry){
        await waitTest();
        return entry;
      },
      "input": {
        "js/a.js": true
      }
    },
    "buildB.js": {
      use:async function(entry){
        await waitTest();
        return entry;
      },
      "input": {
        "js/b.js": true
      }
    }
  }
};


function waitTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Waited for");
    }, 1000);
  });
}