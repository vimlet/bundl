<p align="center">
<a href="https://bundljs.org">
<img src="https://bundljs.org/img/bundl-logo.png" height="100"></img>
</a>
</p>

<p align="center">
<strong>Build & pack anything your way!</strong>
</p>


![NPM](https://img.shields.io/npm/v/@vimlet/bundl)
![License](https://img.shields.io/github/license/vimlet/bundl.svg)
[![Documentation](https://img.shields.io/badge/url-documentation-brightgreen)](https://bundljs.org/docs/#!mode=manual&file=Get%20Started.md)


Bundl is a flexible project bundler for any language. It allows you to split your code and assets in a convenient way for daily work, while optimizing the output for production with the help of any toolchain of your choice.
You can think of Bundl as way to automate your build routine, while you focus on your development.

## Features

* **Fast:** It works asynchronously.
* **Flexible:** Customize any task using NodeJS and NPM packages. 
* **Code Split:** Split your code to easy daily development.
* **Sequencing:** Order tasks in a synchronous way.
* **Configurable:** Friendly configuration file.
* **Watcher Mode:** Track your files and work freely while Bundl triggers in the background.
* **Non Intrusive:** Do things your way.
* **Join/Copy:** Join or copy any assets to the output.
* **Templating:** Use [Meta](https://github.com/vimlet/vimlet-meta) template engine to control the output granularly.

[Installation]<>

You'll need the latest [NodeJS](https://NodeJS.org) release.

> (NodeJS version must be greater than 10.X.X).


**Install through npm:**

```npm install @vimlet/bundl``` 
or simply
```npx @vimlet/bundl```

## Usage

### Command line

**Run:**

```npx bundl```

If no args are provided this option will look for *bundl.config.js* at current working directory.
A config path can be provided with `-c` like so:

```npx bundl -c "path_to_config"```

### As a module

```[javascript]
const bundl = require("@vimlet/bundl");

var config = {
  "output": {
    "build/bundle.js": "src/js/**.js"
  }
};

bundl.build(config);
```

# Documentation

Check the full documentation for configuration details and advanced features at [https://bundlejs.org/doc](https://bundljs.org/docs/#!mode=manual&file=Get%20Started.md)