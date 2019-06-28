# Metapack

metapack is a project bundler and builder.


# Features

* **Fast:** It works asynchronously.
* **Customizable:** It allows the user to add javascript code during the process easily.
* **Sortable:** Sort task if you need synchronous mode.
* **Configuration file:** One single file to control everyone.
* **Watcher mode:** Run once and work freely.
* **Non verbose:** Friendly configuration file.
* **Copy:** Copy built in.
* **Meta:** [Meta](https://github.com/vimlet/vimlet-meta) built in.

# Installation
* Via NPM: npm install @vimlet/metapack

# Usage

* `pack.build(config);`

  Run pack using given configuration object.

## Command mode:


* `metapack`

    Calls metapack. This option will look for *metapack.config.js* at working directory.

* `metapack -c "path_to_config"`

    Calls metapack with given config file path.

* `metapack -w "path_to_watch"`

    Calls metapack and keep watching for changes at given path.

# Configuration file:

A .js file which exports the configuration object.

*IE:*
```
module.exports = {
  ...
};
```

## Main options:
> * outputBase: Generated files will be all within this directory, they will be nested inside following their input path.
> * inputBase: Files will be looking for from this directory.
> * watch: Path to a folder to keep looking for changes.
> * clean: If set to true, outputBase will be empty before starting to parse.
> * output: Object which contains output path as key and configuration.

*IE:*
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

## Output

It is an object where its keys are the output folder within outputBase and its content cant be:

> * Simple string: Path to single input file.
>
>   `"output/subfolder":"input.txt"`
> * String array: An array of paths to input files.
>
>   `"output/subfolder":["input1.txt","input2.txt"]`
> * Object: A configuration object for given output.
>
>   `"output/subfolder":{input:"input.txt", ...}`
> * Object array: An array of configuration objects.
>
>   `"output/subfolder":[{input:"input1.txt", ...},{input:"input2.txt", ...}]`
> * Mixed object and string array.
>
>   `"output/subfolder":[{input:"input1.txt", ...},"input2.txt"]`
## Output options

> * clean: If set to true, current output directory will be empty before pack it. It doesn't empty the outputBase, it empties *outputBase + current output key.*
> * parse: Run meta for given key.
> * order: Set pack order to given key and make it works synchronous only for those keys with order set.


# License
metapack is released under MIT License. See [LICENSE](https://github.com/vimlet/metapack/blob/master/LICENSE) for details.



## Example config
module.exports = {
  "outputBase": "build",
  "watch": "src",
  "inputBase": "src",
  "clean": false,
  "output": {
    "bundle.{{hash}}.js": {
      "order": 0,
      "id": "bundle.js",
      "input": {
        ".js": true
      }      
    },
    "bundle.less": ["a/.css", "b/**.css"],
    "index.html?parse=true": "index.html"
  }
};
