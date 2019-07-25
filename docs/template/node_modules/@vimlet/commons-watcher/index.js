var chokidar = require("chokidar");  

/*
@function watch (public)
@despcription Watch patterns for change and callback when an event is triggered
@param patterns
@param options [event: String or array of events (add,change,unlink,addDir,unlinkDir,error,ready,raw) by default all are triggered]
@return {object} [Return watcher instance]
*/
module.exports.watch = function (patterns, options, callback) {
    var options = options || {};
    var watcher = chokidar.watch(patterns, options);
    if(!options.event){
        watcher.on('all', function(event, path){
            callback(null, {event:event,path:path});
        });
    }else{
        if(!Array.isArray(options.event)){
            watcher.on(options.event, function(event, path){
                callback(null, {event:event,path:path});
            });
        }else{
            options.event.forEach(function(e) {
                watcher.on(e, function(event, path){
                    callback(null, {event:event,path:path});
                });
            }); 
        }
    }
    watcher.on('error', function (error) {
      if (process.platform === 'win32' && error.code === 'EPERM') {
        // Deleting an empty folder doesn't fire on windows
      } else {
        broadcastErr(error);
      }
    });
    return watcher;
}