module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "clean": false,
  // "watch": "test/input",
  "output": {
    "parse/1.txt": {
      "clean": true,
      "order": 0,
      "parse":true,
      "input": {
        "parse/**.vmt": {
          "parse":true,
          "watch":"parse/**"
        },
        "parse2/**.vmt": {
          "watch":"parse/**"
        }
      }
    }
  }
};


function waitTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Waited for");
    }, 100);
  });
}