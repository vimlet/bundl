var log = log || {};



// @function get (public) [Load log data] @param id @param callback
log.get = function (logId, callback) {
  if (logId) {
    var url = "/rest/log/" + session.data.currentWorkspaceId + "/" + logId;
    eon.ajax(url, {
      contentType: "application/json"
    }, function (error, data) {
      if (!error) {
        if (callback) {
          callback(null, data.response);
        }
      } else if (data.status == 401) {
        callback(true);
      } else if (data.status == 500) {
        callback(true);
      }
    });
  }
};