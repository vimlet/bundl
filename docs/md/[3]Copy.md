# Built-in features

## Copy
If any output key ends with **, it will be taken as copy all the files in the path.

IE
```
"copy/**": {
      "clean": true,
      "input": {
        "input/**": true
      }
    }
```
All files within */input* will be copied to */copy* following the structure that they have at */input*