
function inviteMember(workspaceId, mail, data, cb) {
  eon.ajax("/rest/invitation/" + workspaceId + "/" + mail, { method: "POST", contentType: "application/json", payload: JSON.stringify(data)}, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.member.inviteSuccess);
      
      if (cb) {
        data = data.responseText ? JSON.parse(data.responseText) : {};
        cb(null, data);
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
function createInvitation(workspaceId, cb) {
  eon.ajax("/rest/invitation/" + workspaceId, { method: "POST", contentType: "application/json"}, function (error, data) {
    if (!error) {
      if (cb) {
        data = data.responseText ? JSON.parse(data.responseText) : {};
        cb(null, data);
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
function deleteInvitation(workspaceId, invitationId, cb) {
  eon.ajax("/rest/invitation/" + workspaceId + "/" + invitationId, { method: "DELETE", contentType: "application/json"}, function (error, data) {
    if (!error) {
      if (cb) {
        data = data.responseText ? JSON.parse(data.responseText) : {};
        cb(null, data);
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
function cancelInviteMember(workspaceId, invitationId, cb) {
  eon.ajax("/rest/invitation/member/" + workspaceId + "/" + invitationId, { method: "DELETE", contentType: "application/json"}, function (error, data) {
    if (!error) {
      if (cb) {
        data = data.responseText ? JSON.parse(data.responseText) : {};
        cb(null, data);
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

function reinviteMember(workspaceId, mail, data, cb) {
  eon.ajax("/rest/invitation/" + workspaceId + "/" + mail + "/reinvite", { method: "POST", contentType: "application/json", payload: JSON.stringify(data) }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.member.reinviteSuccess);
      if (cb) {
        cb(null, data);
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

function updateMember(workspaceId, data, cb) {
  eon.ajax("/rest/member/" + workspaceId, { method: "PUT", contentType: "application/json", payload: JSON.stringify(data) }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.member.editMemberSuccess);

      if (cb) {
        data = data.responseText ? JSON.parse(data.responseText) : {};
        cb(null, data);
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
function deleteMember(workspaceId, data, cb) {
  eon.ajax("/rest/member/" + workspaceId, { method: "DELETE", contentType: "application/json", payload: JSON.stringify(data) }, function (error, data) {
    if (!error) {
      popup.displayToast(eon.locale.member.deleteMemberSuccess);
      if (cb) {
        data = data.responseText ? JSON.parse(data.responseText) : {};
        cb(null, data);
      }
    } else if (data.status == 401) {
      session.logout();
    } else {
      if (cb) {
        cb(true, data);
      }
    }
  });
}
