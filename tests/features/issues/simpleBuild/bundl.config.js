// const babel = require('../../forks/bundl/plugins/bundl-plugin-babel/index') ;

module.exports = {
  output: 'build/bundle.js', /* {
      use: entry => babel(entry, {
        presets: [require('@babel/preset-env')]
      })
    }, */
    input: 'src/**.js'
  }