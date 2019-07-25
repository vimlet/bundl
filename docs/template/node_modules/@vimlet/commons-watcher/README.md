# Watcher

Look for changes.

## Installation

npm install @vimlet/commons-watcher

It will be also installed as a module within @vimlet/commons
 
## Usage 

>## watcher.watch(patterns, options, callback)
>
> Watch patterns for changes.
>* patterns: Patterns to look for.
>* options: 
>1. event: event: String or array of events (add,change,unlink,addDir,unlinkDir,error,ready,raw) by default all are triggered.
>* callback: callback `function(error, {event:"string",path:"string"})`.

## License
This project is under MIT License. See [LICENSE](https://github.com/vimlet/vimlet-commons/blob/master/LICENSE) for details.
