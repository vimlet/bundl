var task = task || {};
eon.createCallback("onTask_close", task);
// eon.createCallback("onTask_updated", task);
// eon.createCallback("onTask_deleted", task);
eon.createCallback("onTask_labelUpdated", task);
eon.createCallback("onTask_labelDeleted", task);
eon.createCallback("onTask_listChange", task);

task.status = "closed";

// @function open (public) [Open task dialog] @param taskId @param options [workspace: workspace data. board: board data]
task.open = function (taskId, options) {  
  options = options || {};
  task.dialog.open(taskId, options.workspace,options.board);
  task.status = "open";
  task.id = taskId;
  updateUrl(taskId);
}

// @function close (public) [Close tag dialog]
task.close = function () {
  task.dialog.close();
}


// @function init (public) [Initialize task dialog]
task.init = function () {
  task.dialog = getDialog();
  task.dialog.onClose(function () {
    task.id = null;
    task.status = "closed";
    updateUrl(null);
    eon.triggerCallback("onTask_close", task, task);
  });
  // task.dialog.onTaskUpdated(function (taskData) {
  //   eon.triggerCallback("onTask_updated", task, task, [taskData]);
  // });
  var urlParams = new URLSearchParams(window.location.search);
  var taskId = urlParams.get('task');
  if (taskId && taskId != "") {
    task.open(taskId);
  }
}

// @function delete (public) [Delete current task] @param taskId @param callback
task.delete = function (taskId, callback) {
  var taskSplit = taskId.split(":");
  var boardId = taskSplit[0] + ":" + taskSplit[1];
  var url = "/rest/task/" + session.data.currentWorkspaceId + "/" + boardId + "/" + taskId;
  eon.ajax(url, {
    contentType: "application/json",
    method: "DELETE"
  }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.projects.tasks.deleteSuccess);

      // eon.triggerCallback("onTask_deleted", task, task, [taskId]);
      if (callback) {
        callback();
      }
    } else if (data.status == 401) {
      session.logout();
    }
  });
}
// @function update (public) [Update task] @param taskId @param callback
task.update = function (taskId, data, callback) {
  var taskSplit = taskId.split(":");
  var boardId = taskSplit[0] + ":" + taskSplit[1];
  var url = "/rest/task/" + session.data.currentWorkspaceId + "/" + boardId + "/" + taskId;
  eon.ajax(url, {
    contentType: "application/json",
    method: "PUT",
    payload: JSON.stringify(data)
  }, function (error, data) {
    if (!error) {
      // data = JSON.parse(data.responseText);
      // eon.triggerCallback("onTask_updated", task, task, [data]);
      if (callback) {
        callback(null, data.response);
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      if (callback) {
        callback(true);
      }
    }
  });
}


// @function updateLabel (public) [Update a label at database] @param labels
task.updateLabel = function (boardId, labels) {
  var el = this;
  var url = "/rest/board/" + session.data.currentWorkspaceId + "/label/" + boardId;
  var payload = {};
  payload["labels"] = labels;
  eon.ajax(url, {
    contentType: "application/json",
    method: "PUT",
    payload: JSON.stringify(payload)
  }, function (error, data) {
    if (!error) {
    } else if (data.status == 401) {
      session.logout();
    }
  });
},


  // @function list (public) [Change task list]  @param taskId @param listId @param order @param callback
  task.list = function (taskId, listId, order, callback) {
    var taskSplit = taskId.split(":");
    var boardId = taskSplit[0] + ":" + taskSplit[1];
    var url = "/rest/task/" + session.data.currentWorkspaceId + "/" + boardId + "/move/" +
      taskId;
    var payload = {
      list: listId,
      boardId: boardId
    };
    if (typeof order != "undefined" && typeof order == "number") {
      payload.order = order;
    }
    eon.ajax(url, {
      contentType: "application/json",
      method: "PUT",
      payload: JSON.stringify(payload)
    }, function (error, data) {
      if (!error) {
        // data = JSON.parse(data
        //   .responseText);
        // if (callback) {
        //   callback(null, data);
        // }
        // eon.triggerCallback("onTask_listChange", task, task, [data, taskId, listId, order]);
      } else if (data.status == 401) {
        session.logout();
      }
    });
  }

// @function clone (public) [Clone given task] @param taskId @param options[boarId:board id]
task.clone = function(taskId, options){
  options = options || {};
  if(!options.boardId){
    var taskSplit = taskId.split(":");
    options.boardId = taskSplit[0] + ":" + taskSplit[1];
  }
  var url = "/rest/task/" + session.data.currentWorkspaceId + "/" + options.boardId + "/clone/" +
    taskId;    
  eon.ajax(url, {
    contentType: "application/json",
    method: "POST"
  }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.projects.tasks.cloneSuccess);
    } else if (data.status == 401) {
      session.logout();
    }
  });
}


// @function get (public) [Get task data from database]
task.get = function (taskId, callback) {  
  if (taskId) {
    var taskSplit = taskId.split(":");
    var boardId = taskSplit[0] + ":" + taskSplit[1];
    var url = "/rest/task/" + session.data.currentWorkspaceId + "/" + boardId + "/" + taskId;
    eon.ajax(url, {
      contentType: "application/json"
    }, function (error, data) {
      if (!error) {
        if (callback) {
          callback(null, data.response);
        }
      } else if (data.status == 401) {
        session.logout();
      } else if (data.status == 500) {
        callback(true);
        // showInfoDialog(eon.locale.projects.board.task.notFound, function () {});
        // task.close();
      }
    });
  }
};



// @function updateUrl (private) [Update url with task parameter] @param task
function updateUrl(task) {
  var url = window.location.href;
  url = setParameterByName("task", task, url);
  window.history.replaceState({}, null, url);
}

// @function getDialog (private) [Get task dialog]
function getDialog() {
  return document.querySelector("#taskDialog");
}

// @function getBoardData (public) [Get board data] @param boardId @param callback
task.getBoardData = function(boardId, callback) {
  var url = "/rest/board/" + session.data.currentWorkspaceId + "/" + boardId;
  eon.ajax(url, {
    contentType: "application/json"
  }, function (error, data) {
    if (!error) {
      var data = JSON.parse(data.responseText);
      if (callback) {
        callback(data);
      }
    } else if (data.status == 401) {
      session.logout();
    } else if (data.status == 500) {
      showInfoDialog(eon.locale.projects.board.notFound, function () { });
    }
  });
}

// @function getWorkspaceData (public) [Get workspace data] @param callback
task.getWorkspaceData = function(callback) {
  if (session.isAdmin()) {
    var url = "/rest/workspace/" + session.data.currentWorkspaceId;
    eon.ajax(url, {
      contentType: "application/json"
    }, function (error, data) {
      if (!error) {
        if (callback) {
          callback(JSON.parse(data.responseText));
        }
      } else if (data.status == 401) {
        session.logout();
      }
    });
  } else {    
    readWorkspaceForMember(session.data.currentWorkspaceId, session.data.id, function(error,data){
      if (callback) {
        callback(data);
      }
    });
  }
}

// @function isTaskViewer (private) [] @param callback
function isTaskViewer(userId, viewers, cb) {
  if (userId && viewers) {
    var isViewer = false;

    // Check task members
    if (viewers.members) {
      for (var i = 0; i < viewers.members.length; i++) {
        var viewerId = viewers.members[i];
        // Compare ids
        if (viewerId == userId) {
          isViewer = true;
          if (cb) { cb(null, true); }
        }
      };
    }

    if (!isViewer) {
      // Check task groups
      if (viewers.groups) {
        readWorkspaceForMember(session.data.currentWorkspaceId, session.data.id, function (error, data) {
          if (!error) {
            if (data.groups) {
              for (var i = 0; i < viewers.groups.length; i++) {
                var groupId = viewers.groups[i];
                var group = data.groups[groupId];

                // Loop group members
                if (group && group.members) {
                  for (var j = 0; j < group.members.length; j++) {
                    var memberId = group.members[j];
                    if (memberId == userId) {
                      isViewer = true;
                      if (cb) { cb(null, true); }
                      break;
                    }
                  };
                }
              }
            }

            if (!isViewer) {
              if (cb) { cb(null, false); }
            }
          } else {
            // Operation error
            if (cb) { cb(true); }
          }
        });
      } else {
        if (cb) { cb(null, false); }
      }
    }
  } else {
    if (cb) { cb(null, false); }
  }

}