function readAllCalendars(workspaceId, cb) {
  var url = "/rest/calendar/" + workspaceId;
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
function readCalendar(workspaceId, calendarId, cb) {
  var url = "/rest/calendar/" + workspaceId + "/" + calendarId;
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

function createCalendar(workspaceId, data, cb) {
  eon.ajax("/rest/calendar/" + workspaceId, {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(data)
  }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.calendar.createSuccess);

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

function updateCalendar(workspaceId, calendarId, data, cb) {
  var url = "/rest/calendar/" + workspaceId + "/" + calendarId;
  var options = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  };

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.calendar.editSuccess);

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

function deleteCalendar(workspaceId, calendarId, cb) {
  var url = "/rest/calendar/" + workspaceId + "/" + calendarId;
  var options = {
    method: "DELETE",
    contentType: "application/json"
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.calendar.deleteSuccess);

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

function readCalendarEvent(workspaceId, eventId, cb) {
  var url = "/rest/event/" + workspaceId + "/" + eventId;
  var options = {
    contentType: "application/json"
  };

  eon.ajax(url, options, function (error, data) {
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
function createCalendarEvent(workspaceId, calendarId, data, cb) {
  var url = "/rest/event/" + workspaceId + "/" + calendarId;
  var options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(data)
  };

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.calendar.eventCreateSuccess);

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

function updateCalendarEvent(workspaceId, calendarId, eventId, data, cb) {
  var url = "/rest/event/" + workspaceId + "/" + calendarId + "/" + eventId;
  var options = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(data)
  };

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.calendar.eventEditSuccess);

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

function deleteCalendarEvent(workspaceId, calendarId, eventId, cb) {
  var url = "/rest/event/" + workspaceId + "/" + calendarId + "/" + eventId;
  var options = {
    method: "DELETE",
    contentType: "application/json"
  }

  eon.ajax(url, options, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.calendar.eventDeleteSuccess);

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
