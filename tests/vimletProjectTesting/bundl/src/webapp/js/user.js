// @function updateUser (public) [Update user data] @param data @param cb
function updateUser(data, cb) {
  var url = "/rest/user/";
  var options = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }
  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, data);
      }
    } else {
      if (cb) {
        cb(true, null);
      }
    }
  });
}
// @function updatePassword (public) [Update user password] @param data @param cb
function updatePassword(data, cb) {
  var url = "/rest/user/password/";
  var options = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }
  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, data);
      }
    } else {
      if (cb) {
        cb(true, null);
      }
    }
  });
}
// @function updateMenuPreferences (public) [Update user menu preferences] @param data @param cb
function updateMenuPreferences(data, cb) {
  var url = "/rest/user/menu/";
  var options = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }
  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, data);
      }
    } else {
      if (cb) {
        cb(true, null);
      }
    }
  });
}

// @function getOwnWorkspaces (public) [Delete user] @param cb
function getOwnWorkspaces(cb) {
  var url = "/rest/user/ownership";
  var options = {
    method: "GET",
    contentType: "application/json"
  }
  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, data);
      }
    } else {
      if (cb) {
        cb(data.status, data);
      }
    }
  });
}

// @function getOwnUsers (public) [Delete user] @param cb
function getOwnUsers(cb) {
  var url = "/rest/user/ownusers";
  var options = {
    method: "GET",
    contentType: "application/json"
  }
  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, data);
      }
    } else {
      if (cb) {
        cb(data.status, data);
      }
    }
  });
}
// @function deleteAccount (public) [Delete user] @param data @param cb
function deleteAccount(data, cb) {
  var url = "/rest/user/";
  var options = {
    method: "DELETE",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }
  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, data);
      }
    } else {
      if (cb) {
        cb(data.status, data);
      }
    }
  });
}

function leaveWorkspace(data, cb) {
  var url = "/rest/user/leave";
  var options = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }
  
  eon.ajax(url, options, function (error, data) {
    if (!error) {
      if (cb) {
        cb(null, data);
      }
    } else {
      if (cb) {
        cb(data.status, data);
      }
    }
  });
}