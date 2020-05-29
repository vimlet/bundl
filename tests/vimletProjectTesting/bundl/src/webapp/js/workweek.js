function createWorkweek(workspaceId, data, cb) {
  eon.ajax("/rest/workspace/" + workspaceId + "/workweek", { method: "POST", contentType: "application/json", payload: JSON.stringify(data) }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.business.createSuccess);

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
function updateWorkweek(workspaceId, workweekId, data, cb) {
  eon.ajax("/rest/workspace/" + workspaceId + "/" + workweekId, { method: "PUT", contentType: "application/json", payload: JSON.stringify(data) }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.business.editSuccess);

      if (cb) {
        cb(null, JSON.parse(data.responseText))
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
function deleteWorkweek(workspaceId, workweekId, cb) {
  eon.ajax("/rest/workspace/" + workspaceId + "/" + workweekId, { method: "DELETE", contentType: "application/json" }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.business.deleteSuccess);

      if (cb) {
        cb(null, JSON.parse(data.responseText))
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