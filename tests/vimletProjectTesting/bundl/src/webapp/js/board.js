var board = board || {};


// @function defaultView (public) [Set default view]
board.defaultView = function (boardId, view) {
  var el = this;
  var url = "/rest/board/" + session.data.currentWorkspaceId + "/default/" + boardId;
  eon.ajax(url, {
    contentType: "application/json",
    method: "PUT",
    payload: JSON.stringify({
      defaultView: view
    })
  }, function (error, data) {
    if (!error) {      
    } else if (data.status == 401) {
      session.logout();
    }
  });
}



// @function get (public) [Load board data] @param id
board.get = function (boardId, callback) {
  if (boardId) {
    var url = "/rest/board/" + session.data.currentWorkspaceId + "/" + boardId;
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
        // showInfoDialog(eon.locale.projects.project.notFound, function () {});
        // eon.triggerCallback("onBack", el, el);
      }
    });
  }
};