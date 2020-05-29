module.exports = {
  log:false,
  output: {
    "build/webapp/app/bundle.js": "src/webapp/js/**.js",
    "build/webapp/app/css/bundle.css": "src/webapp/css/**.css",
    "build/temp/webapp/less/**": [{
      order: 0,
      parse: true,
      input: {
        "src/webapp/less/**": true
      }
    }],
    "build/webapp/**": [{
        order: 1,
        input: {
          "build/temp/webapp/less/**.less": {
            use: require("./src/bundl/less")
          }
        }
      },
      {
        input: {
          "src/webapp/copy/**": true
        }
      },
      {
        parse: true,
        input: {
          "src/webapp/parse/**": true
        }
      }
    ]
  }
};