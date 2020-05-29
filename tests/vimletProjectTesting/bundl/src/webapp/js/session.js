var session = session || {};
eon.createCallback("onReady", session, "ready");
eon.createCallback("onWorkspaceChanged", session);
eon.createCallback("onWorkspaceEdited", session);

session.getSession = function (selectWorkspace, cb) {
  // Reset onReady callback
  session["__onReady__triggered"] = false;

  eon.ajax("/rest/user", null, function (error, data) {

    if (!error) {
      data = JSON.parse(data.responseText); 

      // Check pending invitations
      session.checkInvitations(function(updateSession){
        // Clean invitation path params
        var url = deleteParameter("inviteEmail");
        url = deleteParameter("inviteToken", url);
        url = deleteParameter("alias", url);
        url = deleteParameter("email", url);

        window.history.pushState({}, null, url);

        // User joined a new workspace so session must be updated
        if(updateSession) {
          session.getSession();
        } else {
          session.setupSession(data);

          if (cb) {
            cb(null, data);
          }
        }
      });
    } else if (data.status == 401) {

      session.logout();
      if (cb) {
        cb(true);
      }

    } else {

      var urlParams = new URLSearchParams(window.location.search);
      var inviteToken = urlParams.get("inviteToken");
      var inviteEmail = urlParams.get("inviteEmail");
      var validate = urlParams.get("validate");
      var token = urlParams.get("token");
      var isInvite = inviteToken;
      var isValidation = validate && token;

      if (isInvite) {
        // Has the user already exist?
        eon.ajax("/rest/user/exists?email=" + inviteEmail, null, function (error, data) {
          // INVITE
          var params = "?inviteToken=" + inviteToken;
          params += inviteEmail ? "&inviteEmail=" + inviteEmail : "";
          window.location.href = !error ? "/app/login.html" + params : "/app/register.html" + params;
        });

      } else if (isValidation) {
        var params = "?validate=" + validate + "&token=" + token;
        window.location.href = "/app/login.html" + params;
      } else {
        window.location.href = "/app/login.html";
        if (cb) {
          cb(true);
        }
      }
    }
  });
};

session.checkInvitations = function (cb) {
  var urlParams = new URLSearchParams(window.location.search);
  var inviteToken = urlParams.get("inviteToken");

  /**
   * TODO - Check user specific invitation
   */

  if (inviteToken) {
    showConfirmDialog(eon.locale.workspace.invitationAlert, function () {
      var dlg = this;
      // Join workspace
      joinWorkspace(inviteToken, function (error, data) {
        if(!error) {
          // Update url with the new workspace id
          // * Used later to navigate to the new workspace
          window.history.pushState({}, null, setParameterByName("workspaceId", data.workspaceInvitedTo));

          if(data.status && data.status == 202) {
            // Already joined
            if(cb) {
              cb();
            }
          } else {
            if(cb) {
              // Session should be refreshed
              cb(true);
            }
          }
        } else {
          showInfoDialog(eon.locale.workspace.alert.joinFail, function(){
            if(cb) {
              cb();
            }
          });
        }
        // Close dialog
        dlg.close();
      });
    }, function(){
      var dlg = this;
      // On cancel
      if(cb) {
        cb();
      }
      // Close dialog
      dlg.close();
    });
  } else {
    // No invitations
    if(cb) {
      cb();
    }
  }
}

session.setupSession = function (data, selectWorkspace) {
  // Store session user
  session.data = data;
  // Set name
  eon.onReady(function () {

    document.querySelector(".user-name").innerHTML = session.data.name;
    setupAvatar(session.data);

    if (window.locale != session.data.language) {
      window.locale = session.data.language;
      eon.ajax("util/locale/" + window.locale + ".json", null, function (error, data) {
        if (!error) {
          eon.locale = JSON.parse(data.responseText);
          eon.triggerCallback("onLocaleLoaded", eon, eon, []);
        }
      });
    } else {
      eon.triggerCallback("onLocaleLoaded", eon, eon, []);
    }

    session.loadWorkspace();

    var urlParams = new URLSearchParams(window.location.search);
    var validate = urlParams.get("validate");
    var token = urlParams.get("token");
    // Email Validation - * Temporary inactive
    if (validate && token) {

      eon.ajax("/rest/user/validate?email=" + validate + "&token=" + token, { method: "PUT", contentType: "application/json" }, function (error, data) {
        if (data.status == 401) {
          session.logout(window.location.href);
        } else {
          var message = !error ? eon.locale.user.alert.emailValidationSuccess : eon.locale.user.alert.emailValidationFail;
          showInfoDialog(message);
        }
      });
    }
  });
}

session.loadWorkspace = function () {
  // Block until user is member of a workspace
  var workspaces = session.data.workspaces ? Object.keys(session.data.workspaces) : [];

  app.isFirstVisit = false;

  if (workspaces.length == 0) {

    eon.import([
      "custom/user/user-view"
    ]);

    eon.onReady(function () {
      // Hide menu button
      app.isFirstVisit = true;
      app.isInWizard = true;
      app.wizard.open();
      util.activateFirstStepsMode();

      eon.triggerCallback("onReady", session, session, [session.data]);

      mask.hide(null, 500);
    });

  } else {
    // Update current workspace and combo
    if (!session.data.currentWorkspaceId) {
      session.data.currentWorkspaceId = getParameterByName("workspaceId") || session.data.defaultWorkspace || workspaces[0];
    }

    session.onWorkspaceChanged(function (workspaceId) {
      session.toggleAdminItems();
      // Clear workspace dependent path params
      var url = deleteParameter("board", url);
      url = deleteParameter("task", url);
      window.history.pushState({}, null, url);
    });

    // Clear combo
    util.leftMenu.onReady(function () {
      util.mainSelector = util.mainSelector || util.mainMenu.querySelector("#main-workspace");
      util.mainSelector.clear();
      util.drawerSelector.clear();

      util.setupWorkspaceMenu(util.mainSelector, workspaces);
      util.setupWorkspaceMenu(util.drawerSelector, workspaces);

      eon.triggerCallback("onReady", session, session, [session.data]);
    });
  }
}

session.logout = function (location) {
  eon.ajax("/logout", { method: "POST", contentType: "application/json" }, function (error, data) {
    if (!error) {
      window.location.href = location || JSON.parse(data.responseText).location;
    } else if (data.status == 401) {
      session.logout();
    }
  });
};

session.toggleAdminItems = function () {
  // Unhide Back Office
  if (session.data.backoffice) {
    document.querySelector("#backoffice-btn").classList.remove("hide");
  } else {
    document.querySelector("#backoffice-btn").classList.add("hide");
  }

  var infoAdminNodes = document.querySelectorAll(".admin-item");

  if (session.isAdmin()) {
    // Show admin items
    for (var i = 0; i < infoAdminNodes.length; i++) {
      infoAdminNodes[i].classList.remove("hide");
    };

    // Setup plan
    session.setupPlan();
  } else {
    // Hide admin items
    for (var i = 0; i < infoAdminNodes.length; i++) {
      infoAdminNodes[i].classList.add("hide");
    };
  }

};
session.setupPlan = function () {
  // Unhide plans management
  var plan = session.data.currentPlan;
  var planField = util.leftMenu.querySelector("#plan-current");
  plan = !plan ? "Basic" : plan;
  planField.querySelector("span").innerHTML = eon.locale.workspace.fields.plan + ": ";
  planField.querySelector("b").innerHTML = plan;

  // Upgrade plan listener
  var upgradePlanBtn = util.leftMenu.querySelector("#plan-upgrade-btn");
  upgradePlanBtn.upgradeFn = upgradePlanBtn.upgradeFn || function (e) {
    showView("upgrade")
  };

  upgradePlanBtn.removeEventListener("click", upgradePlanBtn.upgradeFn, false);
  upgradePlanBtn.addEventListener("click", upgradePlanBtn.upgradeFn, false);
}
session.isAdmin = function () {
  if (session.data.workspaces[session.data.currentWorkspaceId]) {
    return session.data.workspaces[session.data.currentWorkspaceId].role == "admin";
  } else {
    return false;
  }
};

