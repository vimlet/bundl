# Run

Request manager.

## Installation

npm install @vimlet/commons-run

It will be also installed as a module within @vimlet/commons

## Usage

>## run.exec(command, options, doneHandler)
>
>Runs a file or command and streams its output.
>* command: File or command to be executed.
>* options:
>1. execHandler: Default output callback `function(out, error)`, redirects stdout when provided.
>2. args: Executable arguments(string[]).
>3. workingDirectory: The path from where the executable will run.
>* doneHandler: Default done callback `function(error, exitCode)`.

>## run.fetch(command, options, doneHandler)
>
>Runs a file or command and buffers its output.
>* command: File or command to be executed.
>* options:
>1. args: Executable arguments(string[]).
>2. workingDirectory: The path from where the executable will run.
>* doneHandler: Default done callback `function(error, exitCode)`.

## License
This project is under MIT License. See [LICENSE](https://github.com/vimlet/vimlet-commons/blob/master/LICENSE) for details.
