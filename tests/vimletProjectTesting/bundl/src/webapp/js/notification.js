var notification = notification || {};
eon.createCallback("onNotification_empty", notification);
eon.createCallback("onNotification_viewed", notification);
eon.createCallback("onNotification_new", notification);
eon.createCallback("onNotification_clearSection", notification);
eon.createCallback("onNotification_clear", notification);

// @function check (public) [Check if there are new notifications] {boolean}
notification.check = function (callback) {
  session.onReady(function () {
    var url = "/rest/notification/" + session.data.currentWorkspaceId + "/" + session.data.id + "/check";
    eon.ajax(url, {
      contentType: "application/json"
    }, function (error, data) {
      if (!error) {
        if (data.status === 200) {
          callback(true);
        } else if (data.status === 204) {
          callback(false);
        }
      } else if (data.status == 401) {
        session.logout();
      }
    });
  });
}

// @function getNew (public) [Get new notifications data from database] @param callback
notification.getNew = function (callback) {
  var url = "/rest/notification/" + session.data.currentWorkspaceId + "/" + session.data.id + "/new";
  get(url, function(data){
    eon.triggerCallback("onNotification_viewed", notification, notification);
    callback(data);
  });
}

// @function getCleared (public) [Get cleared notifications data from database] @param callback
notification.getCleared = function (callback) {
  var url = "/rest/notification/" + session.data.currentWorkspaceId + "/" + session.data.id + "/cleared";
  get(url, function(data){
    callback(data);
  });
}


// @function clearAllNotifications (public) [Clear all notifications]
notification.clearAll = function (callback) {
  var el = this;
  var url = "/rest/notification/" + session.data.currentWorkspaceId + "/" + session.data.id + "/clear";
  eon.ajax(url, {
    contentType: "application/json",
    method: "PUT"
  }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.notifications.archiveMultipleSuccess);

      if (callback) {
        eon.triggerCallback("onNotification_empty", notification, notification);
        callback();
      }
    } else if (data.status == 401) {
      session.logout();
    }
  });
}

// @function clearSection (public) [Clear all notifications from a section] @param section @param callback
notification.clearSection = function (section, callback) {
  var el = this;
  var url = "/rest/notification/" + session.data.currentWorkspaceId + "/" + session.data.id + "/clearSection";
  eon.ajax(url, {
    contentType: "application/json",
    method: "PUT",
    payload: JSON.stringify(section)
  }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.notifications.archiveMultipleSuccess);

      eon.triggerCallback("onNotification_clearSection", notification, notification, [section]);
      if (callback) {
        callback(section);
      }
    } else if (data.status == 401) {
      session.logout();
    }
  });
}

// @function clearNotification (public) [Clear a notification] @param notificationId
notification.clearNotification = function (notificationId) {
  var el = this;
  var url = "/rest/notification/" + session.data.currentWorkspaceId + "/" + session.data.id + "/status/" + notificationId;
  eon.ajax(url, {
    contentType: "application/json",
    method: "PUT",
    payload:JSON.stringify({status:"cleared"})
  }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.notifications.archiveSuccess);

      eon.triggerCallback("onNotification_clear", notification, notification, [notificationId]);
    } else if (data.status == 401) {
      session.logout();
    }
  });
}


// @function markAsRead (public) [Mark a notification as read] @param notificationId
notification.markAsRead = function (notificationId) {
  var el = this;
  var url = "/rest/notification/" + session.data.currentWorkspaceId + "/" + session.data.id + "/status/" + notificationId;
  eon.ajax(url, {
    contentType: "application/json",
    method: "PUT",
    payload:JSON.stringify({status:"read"})
  }, function (error, data) {
    if (!error) {
    } else if (data.status == 401) {
      session.logout();
    }
  });
}

// @function new (public) [There is a new notification]
notification.new = function(){
  eon.triggerCallback("onNotification_new", notification, notification);
}


// @function get (private) [Get data from database] @param url @param callback
function get(url, callback) {
  session.onReady(function () {
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
  });
}
