# OS

Operating system tools.

## Installation

npm install @vimlet/commons-os

It will be also installed as a module within @vimlet/commons

## Usage


`os.isWindows()`

`os.isLinux()`

`os.isMac()`

`os.is64Bit()`

`os.getUnixUserProfile()`


>## os.setUserEnvironmentVariable(key, value, callback)
>
>Sets environment variables without admin privileges.
>* key: Enviroment variable key.
>* value: Enviroment variable value.
>* callback

>## os.addToUserPath(value, callback)
>
>Sets path variables without admin privileges.
>* value: Path value to append.
>* callback

>## os.killProcessByName(name, options, callback)
>
>Kill a process by its name.
>* name: Name of the process to be killed.
>* options:
>1. execHandler: Default output callback `function(out), >redirects stdout when provided.
>* callback

>## os.createSymlink(dest, src, options, callback)
>
>Creates a symbolic link without admin privileges.
>* dest: Symlink destination path.
>* src: Symlink source path.
>* options:
>2. execHandler: Default output callback `function(out)`, >redirects stdout when provided.
>* callback

>## os.findExec(binary, callback)
>
>Asserts if a command is accessible from the command line.
>
>* binary: Symlink destination path.
>* callback

## License
This project is under MIT License. See [LICENSE](https://github.com/vimlet/vimlet-commons/blob/master/LICENSE) for details.