/*
  @function (public) readHome
  @description Read projects tasks grouped by status and list
  @param {String} workspaceId [Workspace id]
  @param {Function} cb [Callback]
*/
function readHome(userId, cb) {
  var url = "/rest/home/" + userId;
  var options = {
    contentType: "application/json"
  };

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, JSON.parse(data.responseText));
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      if (cb) {
        cb(true);
      }
    }
  });
}