// @function openCreateDialog
function openCreateDialog() {
  var createWorkspaceDialog = document.querySelector("#workspace-create-dialog");
  var form = createWorkspaceDialog.querySelector("workspace-form");
  form.clear();

  form.onSubmit(function (error, data) {
    if (!error) {

      createWorkspace(data, function (error, data) {
        if (!error) {
          var currentWorkspaceId = data.id;
          session.getSession(currentWorkspaceId);
        } else {
          showInfoDialog(eon.locale.workspace.alert.createFail, function () { });
        }
      });
      createWorkspaceDialog.close();
    }
  });
  createWorkspaceDialog.open();
  // Push dialog state
  pushDialogState(createWorkspaceDialog);
}

// @function openDeleteDialog
function openDeleteDialog() {
  showDeleteAlert(eon.locale.workspace.alert.warning, false, function () {
    var alertForm = document.querySelector("#deleteAlert eon-form");
    var alertDialog = document.querySelector("#deleteAlert");

    var formData = alertForm.getData();

    var schema = {
      properties: {
        "deletePassword": {
          required: true
        }
      }
    };

    alertForm.validate(schema, null, function (error) {
      if (!error) {
        deleteWorkspace(session.data.currentWorkspaceId, formData, function (error, data) {
          if (error) {
            if (error == 401) {
              showInfoDialog(eon.locale.workspace.alert.deleteWrong);
            } else {
              showInfoDialog(eon.locale.workspace.alert.deleteFail);
            }

          } else {
            var deleted = session.data.currentWorkspaceId;
            var workspaces = Object.keys(session.data.workspaces);

            for (var i = 0; i < workspaces.length; i++ ){
              if (workspaces[i] == deleted) {   
                workspaces.splice(i, 1);
              }
            };
            
            alertDialog.close();

            session.data.currentWorkspaceId = session.data.defaultWorkspace || workspaces[0];

            util.mainSelector.clear();
            util.drawerSelector.clear();
            util.setupWorkspaceMenu(util.mainSelector, workspaces);
            util.setupWorkspaceMenu(util.drawerSelector, workspaces);

            showView("home");
          }
        });
      }
    });
  });
}

function readWorkspace(workspaceId, cb) {
  var url = "/rest/workspace/" + workspaceId;
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

function readWorkspaceForMember(workspaceId, userId, cb) {
  var url = "/rest/workspace/" + workspaceId + "/" + userId;
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

function createWorkspace(data, cb) {
  eon.ajax("/rest/workspace", {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.workspace.createSuccess);

      if (cb) {
        cb(null, JSON.parse(data.responseText))
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

function joinWorkspace(token, cb) {
  eon.ajax("/rest/member/" + token, {
    method: "POST",
    contentType: "application/json"
  }, function (error, data) {
    if (!error) {
      if(data.status == 202) {
        if (cb) {
          cb(null, JSON.parse(data.responseText))
        }
      } else {
        if (cb) {
          cb(null, JSON.parse(data.responseText))
        }
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

function updateWorkspace(workspaceId, data, cb) {
  eon.ajax("/rest/workspace/" + workspaceId, {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.workspace.editSuccess);

      if (cb) {
        var data = JSON.parse(data.responseText);
        eon.triggerCallback("onWorkspaceEdited", session, session, [data]);
        cb(null, data)
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      if (cb) {
        cb(true)
      }
    }
  });
}

function deleteWorkspace(workspaceId, data, cb) {
  var url = "/rest/workspace/" + workspaceId;
  var options = {
    method: "DELETE",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.workspace.deleteSuccess);
      
      if (cb) {
        cb(null, JSON.parse(data.responseText));
      }
    } else {
      if (cb) {
        cb(data.status);
      }
    }
  });
}

function createWorkweek(workspaceId, data, cb) {
  eon.ajax("/rest/workspace/" + workspaceId + "/workweek", {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, JSON.parse(data.responseText))
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