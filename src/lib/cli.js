var cli = require("@vimlet/cli").instantiate();

module.exports = function() {

  function list(value) {
    var result = value.split(",");
    for (var i = 0; i < result.length; i++) {
      result[i] = result[i].trim();
    }
    return result;
  }
  
  cli
    .value("-i", "--include", "Include patterns", list)
    .value("-e", "--exclude", "Exclude patterns", list)
    .value("-o", "--output", "Output path")
    .flag("-c", "--clean", "Clean output directory")
    .value("-w", "--watch", "Keeps watching for changes")
    .flag("-h", "--help", "Shows help")
    .parse(process.argv);
  
  if (cli.result) {
   
  }
  
  if (cli.result.help) {
    cli.printHelp();
  }


};