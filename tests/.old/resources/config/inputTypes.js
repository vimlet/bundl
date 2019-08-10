module.exports = {
  "outputBase":"tests/unit/output/inputTypes",
  "inputBase":"tests/unit/resources/input",
  "clean": true,
  "log":false,
  "output": {
  "build.{{hash}}.js": {
    "id": "build",
    "input": {
      "js/a.js": true,
      "js/b.js": true,
      "js/c.js":true
    }
  },
  "build.2.js": {
    "input": {
      "js/a.js": true,
      "js/b.js": true,
      "js/c.js":true
    }
  },
  "build.3.js": {
    "input": {
      "js/**.js": true
    }
  },
  "build.4.js": {
    "input": "js/**.js"
  },
  "build.5.js": {
    "input": ["js/**.js"]
  }
}
};