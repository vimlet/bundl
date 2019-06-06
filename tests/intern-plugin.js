var fs = require("fs");
var path = require("path");
var express = require("express");
var app = express();
var rimraf = require("rimraf");
var serverHttp;


intern.on("beforeRun", () => {
  return new Promise(resolve => {
        
    rimraf.sync(path.join(__dirname,"unit/output"));

    // Default config
    var port = 3000;
    var staticPath = path.join(__dirname, "webapp");

    // Serve static content
    app.use(express.static(staticPath));
    
    // HTTP server
    serverHttp = app.listen(port, function () {
      console.log("Main server listening at http://localhost:" + port);
      resolve();
    });
  });
});

intern.on("afterRun", () => {
  return new Promise(resolve => {

    // Gracefully close tunnel
    var testingbot_tunnel_pid = path.join(__dirname, "../../testingbot-tunnel.pid");
    if(fs.existsSync(testingbot_tunnel_pid)) {
      fs.unlinkSync(testingbot_tunnel_pid);
    }

    if(intern.config.leaveRemoteOpen) {
      resolve();
    } else {
      serverHttp.close(function() {
        resolve();
      });
    }
  });
});