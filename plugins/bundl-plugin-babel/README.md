# bundl-plugin-babel

Bundl plugin to compile code using Babel.

## Installation

```sh
# npm
npm i -D bundl-plugin-babel
# yarn
yarn add -D bundl-plugin-babel
```

## Usage

### With `babel.config.js`

```js
const babel = require('bundl-plugin-babel') 

module.exports = {
  output: {
    'build/bundle.js': {
      use: babel,
      input: {
        'src/**.js': true
      }
    }
  }
}
```

### Custom options

```js
const babel = require('bundl-plugin-babel') 

module.exports = {
  output: {
    'build/bundle.js': {
      use: entry => babel(entry, {
        presets: ['@babel/preset-env']
      }),
      input: {
        'src/**.js': true
      }
    }
  }
}
```