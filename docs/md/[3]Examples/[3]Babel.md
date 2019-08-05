# Babel with Bundl

Babel is great tool to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments, and as any other tool it can be used with Bundl.

# Use - Programmatically

Simply install `@babel/core` and your favourite preset, for `example@babel/preset-env`. 
Then add a `use` property with a similar logic to your config:

*Example bundl.config.js*
```[javascript]
module.exports = {
  "output": {
    "build/bundle.js": {
      "use": function(entry) {
        entry.content = require("@babel/core").transformSync(entry.content, {
          presets: [require("@babel/preset-env")]
        }).code;
        return entry;
      },
      "input": {
        "src/**.js": true
      }
    }
  }
};
```

If you want to keep your config object clean, you can always create a NodeJS module for the use function.

*Example use-babel.js*
```[javascript]
module.exports = function(entry) {
  entry.content = require("@babel/core").transformSync(entry.content, {
    presets: [require("@babel/preset-env")]
  }).code;
  return entry;      
};
```

*Example bundl.config.js*
```[javascript]
module.exports = {
  "output": {
    "build/bundle.js": {
      "use": require("./use-babel");
      "input": {
        "src/**.js": true
      }
    }
  }
};
```

# Use - Command Line
*Coming soon...*
