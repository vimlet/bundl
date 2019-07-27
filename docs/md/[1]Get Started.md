# Bundl
Bundl is a project bundler and builder.

# Features
* **Fast:** It works asynchronously.
* **Customizable:** It allows the user to add javascript code during the process easily.
* **Sortable:** Sort task if you need synchronous mode.
* **Configuration file:** One single file to control everyone.
* **Watcher mode:** Run once and work freely.
* **Non verbose:** Friendly configuration file.
* **Copy:** Copy built in.
* **Templating:** [Meta](https://github.com/vimlet/vimlet-meta) built in.

# Installation
* Via NPM: npm install @vimlet/bundl or npx @vimlet/bundl

# Usage
* `pack.build(config);`

  Run pack using given configuration object.

## Command mode
* `bundl`

    Calls bundl. This option will look for *bundl.config.js* at working directory.

* `bundl -c "path_to_config"`

    Calls bundl with given config file path.

* `bundl -w "path_to_watch"`

    Calls bundl and keep watching for changes at given path.

# Configuration file
Bundl uses a configuration file to run.

It is a javascript file which exports the configuration object.

*IE:*
```
module.exports = {
  ...
};
```

# Watch mode
It keeps watching for changes instead of running bundl once and again.