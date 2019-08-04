[Introduction]<>

Bundl is a flexible project bundler for any language. It allows you to split your code and assets in a convenient way for daily work, while optimizing the output for production with the help of any toolchain of your choice.
You can think of Bundl as way to automate your build routine, while you focus on your development.

# Features

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

On your project root, run:

```npm install @vimlet/bundl```

[Usage]<>

## Command line

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
  "output": {
    "build/bundle.js": "src/js/**.js"
  }
};

bundl.build(config);
```

Since bundle.config.js is a node module, it can be imported and passed as an argument to build.

[Configuration]<Configuration file (bundl.config.js)>

## Configuration File

The configuration file is a javascript file that exports a configuration object.
Since its a normal NodeJS javascript file you can use all its API features including:

- imports
- dependencies
- variables
- functions
- comments
- etc

```[javascript]
module.exports = {
  //...
};
```
## Configuration Object

### Configuration Properties

**outputBase:** Generated files will be all within this directory, they will be nested inside following their input path.
**inputBase:** Files will be looking for from this directory.
**watch:** Path to a folder to keep looking for changes.
**clean:** If set to true, outputBase will be empty before start packing.
**output:** The output object, contains the output paths as keys with input patterns or objects as values.

*Example:*
```[javascript]
module.exports = {
  "outputBase": "build",
  "inputBase": "src",
  "watch": "src",
  "clean": true,
  "output": {
    "bundle.js": "js/**.js"
  }
};
```

## Output Object

The output paths are presented as the keys of this object. If global outputBase property is present, it will be added at the start of each output path key.
The output path key can hold several value formats.

**Simple string:** Path to single input file.
```[javascript]
"output/subfolder": "input.txt"
```

**Object:** A configuration object for given output.
```[javascript]
"output/subfolder": {input:"input.txt", ...}
```

**Array:** Can contain both string and object.
```[javascript]
"output/subfolder": [{input:"input1.txt", ...},"input2.txt"]
```

### Configuration Properties

**parse:** Enable [Meta](https://github.com/vimlet/vimlet-meta) template syntax parsing.
**order:** Specify an order and make it works synchronously with other ordered entries. Not sorted keys will be done at the end in asynchronous way.
**id:** Identification for hashes and other parse functions.
**use:** `function(entry){return entry;}` Use custom code to modify the output.
**input:** A string or a configuration object for the input files.

*Example:*
```[javascript]
"output": {
  "outputfile.ext": {
    "clean": true,
    "order": 0,
    "id": "example",
    "input": "inputfile.ext"
  }
}
```

### Hash Interpolation

You can interpolate a shortened file hash as part of the output path key with `{{hash}}`, this will be inserted as a part of the key. 
This is useful for tracking changes or busting caches, since the hash will change when any input file for a given output is modified
When `"parse": true`, it's recommend to add an `id` property, so you can retrieve the name using `<%= hash(id); %>`

*Example:*
```[javascript]
"output": {
  "bundle.{{hash}}.js": {
    "id": "bundle.js",
    //...
  }
}
```

## Input Object

When an input configuration object is used, it's keys are the file paths to use as input for the output.
`*` and `**` patterns can be used to target multiple files. If the path starts with `!` it will exclude that pattern.

If a global inputBase property is specified, it will be added at the start of each path key.

The content can be a boolean true just to mark the file as required.
```[javascript]
"input":{
  "inputfile.ext": true
}
```

### Configuration Properties

You can also provide configuration object that can be used with the following parameters:

**parse:** Run meta for given key.
**use:** `function(entry){return entry;}` Use custom code to modify the input.
**read:** If set to false, file content will not be read. Useful when reading it by other means in `use` function.

*Example:*
```[javascript]
"input": {
  "file.*": true,
  "!file.html": true
}
```

## Use Function

A function which allow the user to modify the content and the filename.

Use can be used either at output object or at input object. The function has the same syntax but some differences.

```[javascript]
function(entry){
  // Do something
  return entry;
}
```

The function has one parameter, entry. And it must return it again.

**When used in output object:**
Entry is an object with the following keys:

**fileName:** Name of the file that will be generated.
**content:** Content of the file.

```[javascript]
"use":function (entry) {
  entry.fileName = entry.fileName.replace(".less", ".css");
  entry.content += "\nconsole.log(\"output use\");";
  return entry;
}
```

**When used in input object:**
Entry is an object with the following keys:

**fileName:** Name of the file that will be generated.
**content:** Content of the file.

```[javascript]
"use":function (entry) {
  entry.fileName = entry.fileName.replace(".less", ".css");
  entry.content += "\nconsole.log(\"output use\");";
  return entry;
}
```

> It is important to know that input use will be done before output use.
> Use allows async functions with await.

```[javascript]
"use": async function (entry) {
  entry.content = await doSomething(entry.content);
  return entry;
}
```

*There are some other properties at entry object such as pattern for input, they can be useful but their modification will not be taken in the bundle process.*

### Third party modules with use

This example shows how you can add `use` to process files with external dependencies.

*Example:*

Processing `.less` files using npm dependency `less`.

```[javascript]
"input": {
  "less/**.less": {
    "use": async function (entry) {
      try {
          entry.fileName = entry.fileName.replace(".less", ".css");
          entry.content = (await require("less").render(entry.content.toString("utf8"), {
          filename: require("path").resolve(entry.file),
          })).css;
        } catch (error) {
          console.log(error);
        }
        return entry;
      }
    }
  }
```

[Query Params]<>

Output keys allow output options to be passed as query params, following the same syntax as HTML query params, in order to simplify some scenarios.

`path?key1=value1&key2?value2`

*Example:*
```[javascript]
"index.html?parse=true":"html/index.html"
```

is the same as:

```[javascript]
"index.html": {
  "parse": true,
  "input": {
    "html/index.html": true
  }
}
```

If an object key has the same property as the one provided by the query params, it will have priority over the query param value.

*Example:*
```[javascript]
"index.html?parse=true": {
  "input": "html/index.html"
}
```

is the same as:

```
"index.html": {
  "parse": true,
  input: {
    "html/index.html": true
  }
}
```

[Copy]<>

If any output key ends with **, it will be interpreted as `copy` task, and all the input files will be copied to that output path.

*Example:*
```[javascript]
"copy/**": {
  "input": {
    "input/**": true
  }
}
```
All files inside `input/**` will be copied to `copy` following the same structure that they had.


[Templating]<>

[Vimlet meta templating engine](https://github.com/vimlet/vimlet-meta) is built in bundl. 

If `"parse": true` meta template engine will parse the file content.

Meta template engine is used to generate files from templates that allow the use of JavaScript and NodeJS API.

*Example:*

Join files with meta:

Template1:
```Hello I'm a template <%template(template2)%>```

Template2:
```I'm another template```

Result:
```Hello I'm a template I'm another template```


Template logic with meta:

Template:
```[javascript]
Hello I'm a template
<%
for(var i = 0; i < 5; i++){
  echo(i);
}
%>
```
Result:
```Hello I'm a template 01234```

If you need more information regarding meta please visit [https://github.com/vimlet/vimlet-meta](https://github.com/vimlet/vimlet-meta).


[Watch]<>

Bundl has the ability to keep track for changes on input files and output again the necessary files without the need to manually run bundl each time.

```bundl -w "path_to_folder"```

This will enable watch mode. If any file under watch directory that matches an input are modified, bundl will run again for those outputs.

It can also be configured at `bundl.config.js` even using array for multiple directories:

```[javascript]
module.exports = {
  "watch": ["src", "doc"],
  "output": {
    //...
  }
};
```

If watch property is added to an input object and watch mode is globally enabled, it will watch the given path for that input instead of the input key.