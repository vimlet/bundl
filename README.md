<p align="center">
<a href="https://bundljs.org">
<img src="https://bundljs.org/img/bundl-logo.png" height="100"></img>
</a>
</p>

<p align="center">
<strong>Build & pack anything your way!</strong>
</p>


[![NPM](https://img.shields.io/npm/v/@vimlet/bundl?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/@vimlet/bundl)
[![License](https://img.shields.io/github/license/vimlet/bundl.svg?style=flat-square)](https://github.com/vimlet/bundl/blob/master/LICENSE)
[![Documentation](https://img.shields.io/badge/url-documentation-green?style=flat-square)](https://bundljs.org/docs/#!mode=manual&file=Get%20Started.md)
[![Codacy grade](https://img.shields.io/codacy/grade/047c241c4b4541769679c4ca4d593eb3.svg?style=flat-square&logo=codacy&logoColor=white)](https://app.codacy.com/app/vimlet/bundl)
[![Travis (.org)](https://img.shields.io/travis/vimlet/bundl/master?style=flat-square&logo=travis&logoColor=white)](https://travis-ci.org/vimlet/bundl)


Bundl is a flexible project bundler for any language. It allows you to split your code and assets in a convenient way for daily work, while optimizing the output for production with the help of any toolchain of your choice.
You can think of Bundl as way to automate your build routine, while you focus on your development.

## ⭐ Features

* **Fast:** It works asynchronously.
* **Flexible:** Customize any task using NodeJS and NPM packages. 
* **Code Split:** Split your code to ease daily development.
* **Sequencing:** Order tasks in a synchronous way.
* **Configurable:** Friendly configuration file.
* **Watcher Mode:** Track your files and work freely while Bundl triggers in the background.
* **Non Intrusive:** Do things your way.
* **Join/Copy:** Join or copy any assets to the output.
* **Templating:** Use [Meta](https://github.com/vimlet/vimlet-meta) template engine to control the output granularly.

## 💿 Installation

You'll need the latest [NodeJS](https://NodeJS.org) release.

> NodeJS version must be greater than 8.X.X


**Install through npm:**

On your project root, run:

```npm install @vimlet/bundl```

## 🔮 Usage

### Command line

*Example bundl.config.js*
```javascript
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

### As a module

```javascript
const bundl = require("@vimlet/bundl");

var config = {
  output: {
    "dist/bundle.js": "src/js/**.js"
  }
};

bundl.build(config);
```

## 📚 Documentation

Check the full documentation for configuration details and advanced features at [https://bundlejs.org/doc](https://bundljs.org/docs/#!mode=manual&file=Get%20Started.md)

## 🔌 Plugins

Bundl can easily be extended with your own code but it also has an official  GitHub plugin repository [https://github.com/vimlet/bundl-plugins](https://github.com/vimlet/bundl-plugins) with plugins for most of the common tools out there.

- babel
- stylus
- bubble
- terser
- etc

 All official plugins can be found under the NPM organization `@bundl`, feel free to request joining the organization and repositories to start contributing to this awesome community.

 **PR**: Are welcome too 😁
