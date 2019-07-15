module.exports = {
  "outputBase": "output",
  "inputBase": "input",
  "log":false,
  "output": {
    "string/**":"this.js",
    "stringArray":["this.js", "js/a.js", "js/b.js"],
    "copy/**": {
      "input": {
        "copy/**": true
      }
    },
    "copyArray/**":[{
      "input": {
        "copy/**": true
      }
    },{
      "input": {
        "js/**": true
      }
    }],
    "mixedArray/**":[{
      "input": {
        "copy/**": true
      }
    },"this.js"]
  }
};
