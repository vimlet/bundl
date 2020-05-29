function readRegistry(workspaceId, userId, data, cb) {
  var url = "/rest/registry/" + workspaceId;

  if (userId) {
    // Workspace user registry resource
    url += "/" + userId;
  }

  var options = {
    method: "GET",
    contentType: "application/json",
    params: data
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, JSON.parse(data.responseText));
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      if (cb) {
        cb(data.status);
      }
    }
  });
}

// function createRegistry(workspaceId, userId, data, cb) {
//   var url = "/rest/registry/new/" + workspaceId + "/" + userId;
//   var options = {
//     method: "POST",
//     contentType: "application/json",
//     payload: JSON.stringify(data)
//   }

//   eon.ajax(url, options, function (error, data) {
//     if (!error) {
//       if (cb) {
//         cb(null, JSON.parse(data.responseText));
//       }
//     } else if (data.status == 401) {
//       session.logout();
//     } else {
//       showInfoDialog(eon.locale.registry.createFail, function () {
//         if (cb) {
//           cb(true);
//         }
//       });
//     }
//   });
// }

function updateRegistry(workspaceId, registryId, data, cb) {
  var url = "/rest/registry/" + workspaceId + "/" + registryId;
  var options = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }
  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.registry.editSuccess);
      if (cb) {
        cb(error, JSON.parse(data.responseText));
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      showInfoDialog(eon.locale.registry.editFail, function () {
        if (cb) {
          cb(false, null);
        }
      });
    }
  });
}

function deleteRegistry(workspaceId, registryId, cb) {
  var url = "/rest/registry/" + workspaceId + "/" + registryId;
  var options = {
    method: "DELETE",
    contentType: "application/json"
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.registry.deleteSuccess);

      if (cb) {
        cb(error, JSON.parse(data.responseText));
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      showInfoDialog(eon.locale.registry.deleteFail, function () {
        if (cb) {
          cb(false, null);
        }
      });
    }
  });
}

function createBatchRegistry(workspaceId, data, cb) {
  var url = "/rest/registry/batch/" + workspaceId;
  var options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.registry.createBatchSuccess);

      if (cb) {
        cb(null, JSON.parse(data.responseText));
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      showInfoDialog(eon.locale.registry.createFail, function () {
        if (cb) {
          cb(true);
        }
      });
    }
  });
}

function deleteBatchRegistry(workspaceId, data, cb) {
  var url = "/rest/registry/" + workspaceId;
  var options = {
    method: "DELETE",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.registry.deleteBatchSuccess);

      if (cb) {
        cb(null, JSON.parse(data.responseText));
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      showInfoDialog(eon.locale.registry.deleteFail, function () {
        if (cb) {
          cb(true);
        }
      });
    }
  });
}

function readRegistryEvent(registryId, eventId, cb) {
  if (registryId) {
    url = "/rest/registry/event/" + registryId + "/" + eventId;

    var options = {
      method: "GET",
      contentType: "application/json"
    }

    eon.ajax(url, options, function (error, data) {
      if (!error) {
        if (cb) {
          cb(null, JSON.parse(data.responseText));
        }
      } else if (data.status == 401) {
        session.logout();
      } else {
        if (cb) {
          cb(data.status);
        }
      }
    });
  }
}

function updateRegistryEvent(workspaceId, userId, registryId, data, cb) {
  var url = "/rest/registry/" + workspaceId + "/" + userId + "/event/" + registryId;
  var options = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(error, JSON.parse(data.responseText));
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      showInfoDialog(eon.locale.registry.editFail, function () {
        if (cb) {
          cb(false, null);
        }
      });
    }
  });
}

function deleteRegistryEvent(workspaceId, userId, registryId, eventId, cb) {
  var url = "/rest/registry/" + workspaceId + "/" + userId + "/event/" + registryId + "/" + eventId;
  var options = {
    method: "DELETE"
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(error, JSON.parse(data.responseText));
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      showInfoDialog(eon.locale.registry.editFail, function () {
        if (cb) {
          cb(false, null);
        }
      });
    }
  });
}