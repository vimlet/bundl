
[Configuration]<Configuration file (bundl.config.js)>

## Configuration File

The configuration file is a javascript file that exports a configuration object.
Since its a normal NodeJS javascript file you can use all its API features including:

- require
- dependencies
- variables
- functions
- comments
- etc

```[javascript]
module.exports = {
  output: {
    // Join .js and .css files
    "dist/bundle.js": "src/js/**.js",
    "dist/bundle.css": "src/css/**.css",
    // Copy other assets
    "dist/**": "src/copy/**"
  }
};
```
### Glob Patterns
Paths parameters and values of the config might use glob patterns where `*` and `**` patterns can be used to target multiple files. If the pattern starts with `!` it will exclude matched paths.

**Glob Syntax:**
- `*` matches any character sequence that does not contain '/'.
- `**` matches any character sequence.
- `!`[pattern] excludes the matches from previous matches.

```
"*.js" Matches any file ending with `.js` for the current directory.

"**.js" Matches any file ending with `.js` for the current directory and subdirectories.

["**", "!**test**"] Matches all files except the ones that contain `test`.
```

## Configuration Object (Root)

### Properties

|Property|Description|
|--------|-----------|
|**outputBase**|Generated files will be all within this directory, they will be nested inside following their input path.|
|**inputBase**|Files will be looking for from this directory.|
|**log**|If set to false, hides verbose output.|
|**watch**|Path to a directory to keep looking for changes.|
|**clean**|If set to true, outputBase will be empty before start packing.|
|**output**|The output object, contains the output paths as keys with input patterns or objects as values.|

*Example:*
```[javascript]
module.exports = {
  outputBase: "dist",
  inputBase: "src",
  watch: "src",
  clean: true,
  output: {
    "bundle.js": "**.js"
  }
};
```

## root.output (Values: String/Object/Array)

The output paths are presented as the keys of this object. If global outputBase property is present, it will be added at the start of each output path key.
The output path key can hold several value formats.

> All file formats can be used not only `.js`

**String:** Path to single input file.
```[javascript]
output: {
  "dist/bundle.js": "src/**.js"
}
```

**Object:** A configuration object for given output.
```[javascript]
output: {
  "dist/bundle.js": { input: "src/**.js" }
}
```

**Array:** Can *ONLY* contain strings since single target output is incompatible with some properties like order for example.
```[javascript]
output: {
  "dist/bundle.js": ["file1.js", "file2.js"]
}
```

### Properties

|Property|Description|
|--------|-----------|
|**parse**|Enable [Meta](https://github.com/vimlet/vimlet-meta) template syntax parsing.|
|**order**|Specify an order and make it works synchronously with other ordered entries. Non-ordered keys will be processed at the end in asynchronous way.|
|**id**|Identification for hashes and other parse functions.|
|**use**|`function(entry){return entry;}` Use custom code to modify the output.|
|**input**|A string or a configuration object for the input files.|

*Example:*
```[javascript]
output: {
  "dist/bundle.js": {
    order: 0,
    id: "example",
    input: "src/**.js"
  }
}
```

## root.output.input (Values: String/Object/Array)

When an input configuration object is used, it's keys are the file paths to use as input for the output.

If a global inputBase property is specified, it will be added at the start of each path key.

*Important:*
> Input paths that match a given pattern, will be added in alphabetical order

The input properties can have a boolean value, just to mark the file as required, or an object with its own properties.


**String:** Path to single input file.
```[javascript]
output: {
  "dist/bundle.js": {
    input: "src/**.js"
  }
}
```

**Object:** A configuration object for given input property.
```[javascript]
output: {
  "dist/bundle.js": {
    input: {
      "src/**.js": {
        parse: true
      }
    }
  }
}
```

**Array:** Can contain only both string and object.
```[javascript]
output: {
  "dist/bundle.js": {
    input: [
      "src/a.js",
      {
        "src/b.js": true
      }
    ]
  }
}
```

### Properties

When using object as value, following parameters are available:

|Property|Description|
|--------|-----------|
|**parse**|Run meta for given key.|
|**use**|`function(entry){return entry;}` Use custom code to modify the file.|
|**read**|If set to false, file content will not be read. Useful when reading it by other means in `use` function.|

*Example:*
```[javascript]
input: [
  "src/**.js",
  "!src/**test**"
]
```

[Hashing]<>

You can interpolate a shortened file hash as part of the output path key with `{{hash}}`, this will be inserted as a part of the key. 
This is useful for tracking changes or busting caches, since the hash will change when any input file for a given output is modified
When `"parse": true`, it's recommend to add an `id` property, so you can retrieve the name using `<%= hash(id); %>`

*Example:*
```[javascript]
output: {
  "bundle.{{hash}}.js": {
    id: "bundle.js",
    //...
  }
}
```

[Use]<>

Property `use` can have as a value a function or an array of functions, which allow the user to modify the content and the output path.
Use function can return a promise or simply use the async keyword.
Use can be used either at output object or at input object. The function has the same syntax but some differences.

*Example:*
```[javascript]
use: async function(entry, bundl){
  // Do something
  return entry;
}
```

or chain multiple use functions with array 

```[javascript]
use: [
  async function(entry, bundl){
    // Do something
    return entry;
  },
  async function(entry, bundl){
    // Do something
    return entry;
  }
]
```

The function has an `entry` parameter and it must return it again.
The `run` parameter servers as reference for the command execution module.

**When used in output object:**
Entry is an object with the following keys:

|Property|Description|
|--------|-----------|
|**path**|Entry path.|
|**content**|Content of the output file.|

*Example:*
```[javascript]
use: function(entry) {
  entry.path = entry.path.replace(".less", ".css");
  entry.content += "\nconsole.log(\"output use\");";
  return entry;
}
```

**When used in input object:**
Entry is an object with the following keys:

|Property|Description|
|--------|-----------|
|**path**|Entry path.|
|**content**| Content of the input file.|

When a pattern like `src/**.js` is used, you get to additional properties:

|Property|Description|
|--------|-----------|
|**match**|When pattern used, is the file that matched the pattern.|
|**pattern**| When pattern used, is the pattern that matched the file.|

*Example:*
```[javascript]
use: function(entry) {
  entry.path = entry.path.replace(".less", ".css");
  entry.content += "\nconsole.log(\"output use\");";
  return entry;
}
```

> It is important to know that input use will be done before output use.
> Use allows async functions with await.

*Example:*
```[javascript]
use: async function(entry) {
  entry.content = await doSomething(entry.content);
  return entry;
}
```

### Third party modules with use

This example shows how you can add `use` to process files with external dependencies.

*Example:*

Processing `.less` files using npm dependency `less`.

```[javascript]
input: {
  "less/**.less": {
    use: async function(entry) {
      try {
          var file = entry.path;
          entry.path = entry.path.replace(".less", ".css");
          entry.content = (await require("less").render(entry.content.toString("utf8"), {
          filename: require("path").resolve(file),
          })).css;
        } catch(error) {
          console.log(error);
        }
        return entry;
      }
    }
  }
```

*Note:*
> Check examples and plugins for a better understanding on how all this options interact together.

[Plugins]<>
Bundl can easily be extended with your own code but it also has an official GitHub plugin repository [https://github.com/vimlet/bundl-plugins](https://github.com/vimlet/bundl-plugins) with plugins for most of the common tools out there.

*Example:*
```[javascript]
module.exports = {
  output: {
    "dist/bundle.js": {
      use: [
        // Plugins
        require("@bundl/plugin1"),
        require("@bundl/plugin2"),
        require("@bundl/plugin3")
      ],
      input: "src/**.js"
    }
  }
};
```

All official plugins can be found under the NPM organization @bundl.

[QueryParam]<>

Output keys allow output options to be passed as query params, following the same syntax as HTML query params, in order to simplify some scenarios.

`path?key1=value1&key2?value2`

*Example:*
```[javascript]
"index.html?parse=true":"html/index.html"
```

is the same as:

```[javascript]
"index.html": {
  parse: true,
  input: {
    "html/index.html": true
  }
}
```

If an object key has the same property as the one provided by the query params, it will have priority over the query param value.

*Example:*
```[javascript]
"index.html?parse=true": {
  input: "html/index.html"
}
```

is the same as:

```
"index.html": {
  parse: true,
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
  input: {
    "input/**": true
  }
}
```
All files inside `input/**` will be copied to `copy` following the same structure that they had.


[Templating]<>

Bundl has built-in support for templates with [@vimlet/meta](https://github.com/vimlet/vimlet-meta) templating engine. 

If `parse: true` meta template engine will parse the file content.

Meta template engine is used to generate files from templates that allow the use of JavaScript and NodeJS API.

*Example:*

Join files with meta:

Template1:
```Hello I'm a template <% template("template2") %>```

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

```bundl -w "path_to_directory"```

This will enable watch mode. If any file under watch directory that matches an input are modified, bundl will run again for those outputs.

It can also be configured at `bundl.config.js` even using array for multiple directories:

*Example:*
```[javascript]
module.exports = {
  watch: ["src", "doc"],
  output: {
    //...
  }
};
```

If watch property is added to an input object and watch mode is globally enabled, it will watch the given path for that input instead of the input key.

[Order]<>
An `order` property can be added to both output and input objects, to determine the order of how files will be processed. In this way we can force a synchronous behaviour with other ordered entries. Non-ordered keys will be processed at the end in asynchronous way.

*Example:*
```[javascript]
output: {
  "file1.js": {
    order: 0,
    input: "file1.js"
  },
  "file2.js": {
    order": 1,
    input: "file2.js"
  }
}
```

[Run]<>

Bundl has the ability to execute commands for you with its `run` module.

## Run functions

|Function|Description|
|--------|-----------|
|**exec(command, options, doneHandler)**| Executes the command and streams the output.|
|**fetch(command, options, doneHandler)**| Executes the command and grabs the output.|

### options
- **execHandler:** Default output callback `function(out, error)`, redirects stdout when provided.
- **args:**  Executable arguments array.
- **workingDirectory:** The path from where the executable will run.

*Example:*
```[javascript]
const { run } = require("@vimlet/bundl");

var donePromise = run.exec("ping", {
  args: ["8.8.8.8"]
});

var resultPromise = run.fetch("ping", {
  args: ["8.8.8.8"]
});
```

For convenience, `use` function provides a reference to `bundl` as a second argument which can be used to access `bundl.run`.

*Example:*
```[javascript]
use: async function(entry, bundl) {
  await bundl.run.exec("ping", {
    args: ["8.8.8.8"],
    execHandler: function(out, error) {
      console.log(out);
    }
  });
  return entry;
}
```