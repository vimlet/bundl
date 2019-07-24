
# Watch
Bundl has the ability to keep tracking for changes and built again the modified file for you without.

`bundl -w "path_to_folder"`
will enable watch mode. If any file under watch directory is modified, it will be packed again.

It can also be configured at bundl.config.js:

```
module.exports = {
  "outputBase": "build",
  "watch": "src",
  "inputBase": "src",
  "clean": true,
  "output": {
    ...
  }
};
```
Set as main key will enable watch mode in that path.

Set at input object will not enable watch mode but if watch mode is enable, it will watch the given path for that input instead of the input key.