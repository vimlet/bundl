
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
**log:** If set to false, hides verbose output.
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
**order:** Specify an order and make it works synchronously with other ordered entries. Non-ordered keys will be processed at the end in asynchronous way.
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

*Important:*
> Input paths that match a given pattern, will be added in alphabetical order

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

A function or an array of functions, which allow the user to modify the content and the filename.

Use can be used either at output object or at input object. The function has the same syntax but some differences.

```[javascript]
use: function(entry){
  // Do something
  return entry;
}
```

The function has one parameter, entry. And it must return it again.

**When used in output object:**
Entry is an object with the following keys:

**file:** The output path.
**fileName:** Name of the file that will be generated.
**content:** Content of the output file.

```[javascript]
"use":function (entry) {
  entry.fileName = entry.fileName.replace(".less", ".css");
  entry.content += "\nconsole.log(\"output use\");";
  return entry;
}
```

**When used in input object:**
Entry is an object with the following keys:

**file:** The input path relative to the current working directory.
**fileName:** Name of the file that will be generated.
**content:** Content of the input file.
**match:** When pattern used, is the file that matched the pattern.
**pattern:** When pattern used, is the pattern that matched the file.

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

*Note:*
> Check examples and plugins for a better understanding on how all this options interact together.

[Plugins]<>
Bundl can easily be extended with your own code but it also has an official GitHub plugin repository [https://github.com/vimlet/bundl-plugins](https://github.com/vimlet/bundl-plugins) with plugins for most of the common tools out there.

```[javascript]
module.exports = {
  "output": {
    "build/bundle.js": {
      "use": [
        // Plugins
        require("@bundl/plugin1"),
        require("@bundl/plugin2"),
        require("@bundl/plugin3")
      ],
      "input": "src/**.js"
    }
  }
};
```

All official plugins can be found under the NPM organization @bundl.

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

[Order]<>
An `order` property can be added to both output and input objects, to determine the order of how files will be processed. In this way we can force a synchronous behaviour with other ordered entries. Non-ordered keys will be processed at the end in asynchronous way.

*Example:*
```[javascript]
"output": {
  "outputfile1.ext": {
    "clean": true,
    "order": 0,
    "id": "example",
    "input": "inputfile1.ext"
  },
  "outputfile2ext": {
    "clean": true,
    "order": 1,
    "id": "example",
    "input": "inputfile2.ext"
  }
}
```

[Exec]<>
*Coming soon...*
