[Introduction]<>

Bundl is a flexible project bundler for any language. It allows you to split your code and assets in a convenient way for daily work, while optimizing the output for production with the help of any toolchain of your choice.
You can think of Bundl as way to automate your build routine, while you focus on your development.

# Features

* **Fast:** It works asynchronously.
* **Flexible:** Customize any task using NodeJS and NPM packages. 
* **Code Split:** Split your code to ease daily development.
* **Sequencing:** Order tasks in a synchronous way.
* **Configurable:** Friendly configuration file.
* **Watcher Mode:** Track your files and work freely while Bundl triggers in the background.
* **Non Intrusive:** Do things your way.
* **Join/Copy:** Join or copy any assets to the output.
* **Templating:** Use [Meta](https://github.com/vimlet/vimlet-meta) template engine to control the output granularly.

[Installation]<>

You'll need the latest [NodeJS](https://NodeJS.org) release.

> NodeJS version must be greater than 8.X.X


**Install through npm:**

On your project root, run:

```npm install @vimlet/bundl```

[Usage]<>

## Command line

*Example bundl.config.js*
```[javascript]
module.exports = {
  output: {
    "dist/bundle.js": "src/js/**.js"
  }
};
```

On your project root, run:

```npx @vimlet/bundl```

or simply 

```npx bundl```

If no args are provided this option will look for *bundl.config.js* at current working directory.
A config path can be provided with `-c` like so:

```npx bundl -c "path_to_config"```

## As a module

```[javascript]
const bundl = require("@vimlet/bundl");

var config = {
  output: {
    "dist/bundle.js": "src/js/**.js"
  }
};

bundl.build(config);
```

Since bundle.config.js is a node module, it can be imported and passed as an argument to build.