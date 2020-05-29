var util = util || {};

util.isoFormat = "YYYY-MM-DD[T]HH:mm:ss.SSSZ";

function initSockets() {
  var hostname = window.location.hostname == "tobeio.com" ? "static.tobeio.com" : window.location.hostname;
  var port = window.location.port ? ":" + window.location.port : "";
  app.notificationUrl = window.location.protocol + "//" + hostname + port;

  // app.socket = io.connect(app.notificationUrl);
  session.onReady(function () {
    app.socket = io.connect(app.notificationUrl, {
      path: "/ws",
      query: "user=" + session.data.id
    });
    socket.listen();
  });
}

function mainSetup() {
  app.sections = {};

  mask.onHide(function () {
    document.querySelector(".main").style.visibility = "visible";
  });

  // Tag document body with the current view
  var pathStr = window.location.pathname.split("/")[2];
  document.body.dataset.view = !pathStr || pathStr.includes(".html") ? "home" : pathStr;

  // Setup history navigation
  addNavigationListener();
}

function addNavigationListener() {
  // Add state listener
  window.addEventListener("popstate", function (e) {
    if (!e.state || !e.state.dialog) {
      // Close current dialog
      if (app.openedDialog) {
        app.openedDialog.close();
        delete app.openedDialog;
      }
    }
  });
}

function pushDialogState(dialog) {
  var url = window.location.href.split("#")[0];
  app.openedDialog = dialog;
  window.history.pushState({}, null, url + "#dialog");
}

function setMomentLocale(locale) {
  moment.locale(locale);
}

function setupMenus() {
  setupLeftMenu();
  setupWizardMenu();
  setupMainMenu();
  setupSections();
}

function setupLeftMenu() {
  util.mainMenu = document.querySelector(".main-menu");
  util.leftMenu = document.querySelector(".left-menu");

  util.leftMenuOverlay = document.createElement("div");
  util.leftMenuOverlay.classList.add("left-menu-overlay");

  // Toggle left menu functionality
  util.mainMenu.onReady(function () {
    firstMenuSectionHighlight();

    // Plan field
    session.onReady(function () {
      util.leftMenuHolder = util.leftMenu.querySelector(".drawer-overlay-holder");
      util.leftMenuPlaceHolder = document.querySelector(".drawer-placeholder");
      util.leftMenuHolder.appendChild(util.leftMenuOverlay);

      util.drawerMenuIcon = util.leftMenu.querySelector("#drawer-menu-icon");

      // Check drawer initial position from user preferences
      if (session.data.collapsedMenu) {
        // Cancel transition until everything is rendered
        // var anim = util.leftMenu.style.transition;
        util.collapseDrawer();
      } else {
        util.expandDrawer();
      }

      // Toggle menu
      util.drawerMenuIcon.addEventListener("click", function (e) {
        // util.drawerMenuIcon.querySelector(".clickable").addEventListener("click", function (e) {
        if (util.leftMenu.classList.contains("collapsed")) {
          util.expandDrawer();
        } else {
          util.collapseDrawer();
        }
      }, false);
    });

    util.leftMenu.onStaticReached(function () {
      this.close();
      util.toggleDrawerOverlay("close");
    });
  });
}

function setupWizardMenu() {
  eon.onReady(function () {

    util.wizardBackButton = document.querySelector(".wizard-back-btn");
    util.wizardBackButton.addEventListener("click", function (e) {
      window.history.replaceState({}, null, "/app");
      app.wizard.open();
      // Hide menu button
      util.activateFirstStepsMode();
      document.body.style = "overflow: hidden;"
      util.wizardBackButton.classList.add("hide");
    }, true);
  });
}

function showView(view, params) {
  // Close left menu on device resolution
  if (util.leftMenu.closable) {
    util.leftMenu.close();
  }

  var pathname = "/app/" + view + window.location.search;

  if (params) {
    for (var key in params) {
      var value = params[key];
      pathname = setParameterByName(key, value, pathname);
    }
  }

  // Toggles between highlight/normal section button style
  highlightSectionButton(view);

  client_render.view(pathname);
}

function firstMenuSectionHighlight() {
  var href = window.location.href;
  var section = href.substring(href.lastIndexOf('/') + 1);
  section = section.split("?")[0];

  section = section != "" ? section : "home";

  highlightSectionButton(section);
}

function highlightSectionButton(view) {
  var highlightedSectionButton = document.querySelector(".left-menu .section-highlight");

  if (highlightedSectionButton) {
    highlightedSectionButton.classList.remove("section-highlight");
  }

  if (!~["user"].indexOf(view)) {
    view = !view ? "home" : view;
    var sectionButton = document.querySelector(".left-menu ." + view + "-section-btn");
    if (sectionButton) {
      sectionButton.classList.add("section-highlight");
    }
  }
}

function setupSections() {
  app.sectionsElm = document.querySelector(".sections");

  client_render.onViewChanged(function (view) {

    var viewPath = view.split("/");
    view = viewPath[viewPath.length - 1];
    view = !view ? "home" : view;
    view = view.split("#")[0];
    view = view.split("?")[0];
    cleanViewUrl(view);
    document.body.dataset.view = view;
    // Scroll body to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;

    eon.onReady(function () {
      // Store view      
      if (!app.sections[view]) {
        app.sections[view] = document.querySelector(".sections " + view + "-view");
      }

      // Refresh view
      if (app.sections[view] && app.sections[view].refresh) {
        app.sections[view].onReady(function () {
          // Show mask
          app.sections[view].refresh();
        });
      }

    });
  });

  // @function cleanViewUrl (private) [Clean url params when changing view] @param view
  function cleanViewUrl(view) {
    switch (view) {
      case "projects":
        var url = deleteParameter("board");
        url = deleteParameter("task", url);
        window.history.pushState({}, null, url);
        break;
    }
  }

  // Avoid on rendering visual bugs
  eon.onReady(function () {
    app.sectionsElm.style.display = "flex";
  });
}

function setupMainMenu() {
  eon.onReady(function () {
    util.mainSelector = util.mainMenu.querySelector("#main-workspace");
    app.userMenu = document.querySelector(".user");
    app.userMenuCombo = document.querySelector(".user-combo");
    app.userMenuAvatar = document.querySelector(".menuAvatar");
    app.userMenuIcon = document.querySelector(".user > i");
    app.menuIcon = util.mainMenu.querySelector("#main-menu-icon");
    app.drawerMenuIcon = util.mainMenu.querySelector("#drawer-menu-icon");

    // Toggle menu
    app.menuIcon.addEventListener("click", function (e) {
      // app.menuIcon.querySelector(".clickable").addEventListener("click", function (e) {
      util.leftMenu.toggle();
    }, false);

    util.leftMenu.onOpen(function () {
      // Show drawer overlay
      util.toggleDrawerOverlay();
      app.menuIcon.classList.remove("collapsed");
    });
    util.leftMenu.onClose(function () {
      util.toggleDrawerOverlay("close");
      app.menuIcon.classList.add("collapsed");
    });

    app.userMenu.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      app.userMenuCombo.expand();
    }, false);

    // Set combo items language
    // * Locale is not loaded yet when combo inits
    app.userMenuCombo.onReady(function () {
      eon.onLocaleLoaded(function () {
        for (var key in app.userMenuCombo._misc.items) {
          var item = app.userMenuCombo._misc.items[key];
          item.displayValue = eon.locale.main.sticky[key];
          item.$1("span").innerHTML = item.displayValue;
        };
      });
    });

    app.userMenuCombo.onSelected(function (item) {
      switch (item.value) {
        case "settings":
          // Show user settings
          if (app.isInWizard) {
            util.wizardBackButton.classList.remove("hide");
            document.body.style = "overflow: auto;";
            app.wizard.close();
          }
          showView("user");
          break;
        default:
          // Logout
          session.logout();
          break;
      }
    });

    // Plan field
    util.leftMenu.onReady(function () {
      util.drawerSelector = util.leftMenu.querySelector("#drawer-workspace");
    });
  });
}

function setupAvatar(data) {
  var avatar = $1(".menuAvatar");
  var name = !data.name ? "" : data.name;

  avatar.userName = name;
  avatar.image = "/rest/user/avatar";
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"À-ž]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setParameterByName(key, value, uri) {
  if (!uri) uri = window.location.href;
  var i = uri.indexOf('#');
  var hash = i === -1 ? '' : uri.substr(i);
  uri = i === -1 ? uri : uri.substr(0, i);

  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";

  if (!value) {
    // remove key-value pair if value is empty
    uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
    if (uri.slice(-1) === '?') {
      uri = uri.slice(0, -1);
    }
    // replace first occurrence of & by ? if no ? is present
    if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
  } else if (uri.match(re)) {
    uri = uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    uri = uri + separator + key + "=" + value;
  }
  return uri + hash;
}

function deleteParameter(key, uri) {
  if (!uri) uri = window.location.href;
  var i = uri.indexOf('#');
  var hash = i === -1 ? '' : uri.substr(i);
  uri = i === -1 ? uri : uri.substr(0, i);

  // remove key-value pair if value is empty
  uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
  if (uri.slice(-1) === '?') {
    uri = uri.slice(0, -1);
  }
  // replace first occurrence of & by ? if no ? is present
  if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');

  return uri + hash;
}

function showInfoDialog(content, cb) {
  var dialog = document.querySelector("#alert-dialog");
  eon.locale.alertMessage = content;

  if (!window.__alertContent) {
    var container = document.createElement("div");
    container.classList.add("alert-text");
    // container.innerHTML = content;
    container.innerHTML = eon.locale.alertMessage;
    dialog.content.appendChild(container);

    window.__alertContent = true;
  } else {
    var container = document.querySelector(".alert-text");
    // container.innerHTML = content;
    container.innerHTML = eon.locale.alertMessage;
  }

  dialog.onClose(function () {
    if (cb) {
      cb()
    }
  });

  dialog.open();
}

function openDeleteConfirmation(clickFn) {
  var deleteDialog = document.querySelector("#deleteDialog");
  var deleteButton = document.querySelector("#delete-confirmation");

  if (deleteButton._deleteFn) {
    deleteButton.removeEventListener("click", deleteButton._deleteFn);
  }

  deleteButton._deleteFn = clickFn;

  deleteButton.setAttribute("onclick", "");
  deleteButton.addEventListener("click", deleteButton._deleteFn);

  deleteDialog.open();

  deleteButton.onClick(function () {
    deleteDialog.close();
  });
}

function showDeleteAlert(textContent, password, clickFn, cb) {
  var dialog = document.querySelector("#deleteAlert");
  var button = document.querySelector("#deleteAlert-confirmation");
  var text = document.querySelector("#delete-text");

  if (password) {
    dialog.querySelector("[type='password']").classList.add("hide");
  }

  eon.locale.alertMessage = textContent;
  // text.innerHTML = textContent;
  text.innerHTML = eon.locale.alertMessage;

  if (button._deleteFn) {
    button.removeEventListener("click", button._deleteFn);
  }

  button._deleteFn = clickFn;

  button.setAttribute("onclick", "");
  button.addEventListener("click", button._deleteFn.bind(dialog));

  dialog.open();

  dialog.onClose(function () {
    if (cb) {
      cb();
    }
  });
}

function showConfirmDialog(text, confirmCb, cancelCb, closeCb) {
  var dialog = document.querySelector("#confirm-dialog");

  dialog.onReady(function () {
    var accept = document.querySelector("#confirm-dialog-accept");
    var cancel = document.querySelector("#confirm-dialog-cancel");
    // Check previous content
    var contentText = dialog.content.querySelector(".alert-text");
    if (!contentText) {
      contentText = document.createElement("div");
      contentText.classList.add("alert-text");
      dialog.content.appendChild(contentText);
    }
    contentText.innerHTML = text;

    // Remove confirm button last listener
    if (accept._confirmFn) {
      accept.removeEventListener("click", accept._confirmFn);
    }
    accept._confirmFn = confirmCb;
    accept.setAttribute("onclick", "");
    // Add the accept listener
    if (accept._confirmFn) {
      accept.addEventListener("click", accept._confirmFn.bind(dialog));
    }

    // Remove cancel button last listener
    if (cancel._cancelFn) {
      cancel.removeEventListener("click", cancel._cancelFn);
    }
    cancel._cancelFn = cancelCb;
    cancel.setAttribute("onclick", "");
    // Add the accept listener
    if (cancel._cancelFn) {
      cancel.addEventListener("click", cancel._cancelFn.bind(dialog));
    }

    dialog.onClose(function () {
      if (closeCb) {
        closeCb();
      }
    });

    dialog.open();
  });
}

function getCurrentSection() {
  // data-imported="true" && !display:none
  var sections = app.sectionsElm.querySelectorAll(".view-render");
  var computedStyle;

  for (var i = 0; i < sections.length; i++) {
    computedStyle = window.getComputedStyle(sections[i]).getPropertyValue("display");

    if (sections[i].getAttribute("data-imported") == "true" && computedStyle != "none") {
      return sections[i].getAttribute("data-path").split("./sections/")[1].split(".html")[0];
    }

  }
}

function getEventTypeIcon(type) {

  var icons = {
    entry: "ticon-enter",
    food: "ticon-food",
    break: "ticon-coffee",
    absence: "ticon-alert",
    activity: "ticon-meeting",
    exit: "ticon-exit"
  }

  return icons[type];
}

util.importStripeAPI = function () {

  if (!app.stripeImported) {
    // Called once stripe is imported
    window.initStripe = function() {
      eon.triggerCallback("stripeReady", app, app);
    }

    // Create the script tag, set the appropriate attributes
    var script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.defer = true;
    script.async = true;
    script.onload = window.initStripe;

    // Append the 'script' element to 'head'
    document.head.appendChild(script);
    app.stripeImported = true;
  }
}

util.importMapsAPI = function () {

  if (!app.googleMapsImported) {
    // Create the script tag, set the appropriate attributes
    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + app.googleMapsKey + "&libraries=places&callback=initMaps";
    script.defer = true;
    script.async = true;

    // Append the 'script' element to 'head'
    document.head.appendChild(script);
    app.googleMapsImported = true;

    window.initMaps = function () {
      eon.triggerCallback("mapsReady", app, app);
    };
  }
}

util.initGoogleMap = function (node, latitude, longitude, loaded, cb) {
  var map = new google.maps.Map(node, {
    zoom: 16,
    center: {
      lat: latitude,
      lng: longitude
    },
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.LEFT_TOP
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    fullscreenControl: true
  });

  var marker = new google.maps.Marker({
    position: {
      lat: latitude,
      lng: longitude
    },
    map: map
  });

  if (loaded) {
    if (cb) {
      cb(map, marker)
    }
  } else {
    // Execute callback only the first time the map is loaded
    google.maps.event.addListenerOnce(map, 'idle', function () {
      if (cb) {
        cb(map, marker);
      }
    });
  }
}
util.expandDrawer = function () {
  util.leftMenu.classList.remove("collapsed");
  util.drawerMenuIcon.classList.remove("collapsed");
  util.leftMenuPlaceHolder.classList.remove("collapsed");

  // Save position on user preferences
  var formData = {
    collapsedMenu: false
  }
  updateMenuPreferences(formData);
}
util.collapseDrawer = function () {
  util.leftMenu.classList.add("collapsed");
  util.drawerMenuIcon.classList.add("collapsed");
  util.leftMenuPlaceHolder.classList.add("collapsed");

  // Save position on user preferences
  var formData = {
    collapsedMenu: true
  }
  updateMenuPreferences(formData);
}

util.toggleDrawerOverlay = function (close) {
  if (util.leftMenuHolder) {
    if (util.leftMenuOverlay.classList.contains("eon-bg1-modal") || close) {
      util.leftMenuOverlay.classList.remove("eon-bg1-modal");
      util.leftMenuHolder.appendChild(util.leftMenuOverlay);
    } else {
      util.leftMenuOverlay.classList.add("eon-bg1-modal");
      document.body.appendChild(util.leftMenuOverlay);
    }
  }
};

util.setupWorkspaceMenu = function (menu, workspaces) {
  // Create workspaces item
  for (var i = 0; i < workspaces.length; i++) {
    var workspaceId = workspaces[i];
    var workspace = session.data.workspaces[workspaceId];

    if (workspaceId == session.data.currentWorkspaceId) {
      menu.setData({
        label: workspace.name,
        bubble: workspace.color,
        role: workspace.role,
        workspaceId: workspaceId
      });
    }

    // Select workspace item listener
    menu.addItem(workspaceId, workspace, function (item) {
      // Load new workspace
      item.addEventListener("click", function (e) {
        window.history.pushState({}, null, setParameterByName("workspaceId", item.value));
        session.data.currentWorkspaceId = item.value;
        eon.triggerCallback("onWorkspaceChanged", session, session, [session.data.currentWorkspaceId]);

        // Update both workspace menus
        util.updateWorkspaceMenusInput(item.data, item.value);
        menu.close();
      }, false);
    });
  }

  // Update menu items when workspace has changed
  session.onWorkspaceEdited(function (data) {
    if (data) {
      // Update session data
      session.data.workspaces[data.id].color = data.color;
      session.data.workspaces[data.id].name = data.name;
      menu.updateSelected(data);
    }
  });
};

util.updateWorkspaceMenusInput = function (workspace, workspaceId) {
  util.mainSelector.setData({
    label: workspace.name,
    bubble: workspace.color,
    role: workspace.role,
    workspaceId: workspaceId
  });

  util.drawerSelector.setData({
    label: workspace.name,
    bubble: workspace.color,
    role: workspace.role,
    workspaceId: workspaceId
  });
}

util.activateFirstStepsMode = function () {
  util.leftMenu.classList.add("hide");
  util.leftMenu.querySelector("#drawer-menu-icon").classList.add("hide");
  util.mainMenu.classList.add("overlap");
  app.menuIcon.classList.add("hide");
  util.mainMenu.querySelector(".main-menu-workspace").classList.add("hide");
  document.querySelector("#alert-dialog").classList.add("overlap");
  document.body.style = "overflow: hidden;";
}
util.deactivateFirstStepsMode = function () {
  util.leftMenu.classList.remove("hide");
  util.leftMenu.querySelector("#drawer-menu-icon").classList.remove("hide");
  util.mainMenu.classList.remove("overlap");
  app.menuIcon.classList.remove("hide");
  util.mainMenu.querySelector(".main-menu-workspace").classList.remove("hide");
  util.wizardBackButton.classList.add("hide");
  document.querySelector("#alert-dialog").classList.remove("overlap");
  document.body.style = "overflow: auto;"

  app.wizard._misc.completed = true;
  app.isFirstVisit = false;
}
util.resetCallback = function (name, node) {
  node["__" + name] = [];
  node["__" + name + "__triggered"] = false;
}

util.openDlgOperations = function (dlg, mask, renderedCallback) {
  // dlg.onOpened(function () {
  //   // Show mask
  //   if (mask) {
  //     mask.show();
  //   }
  // });

  dlg.onOpenRendered(function () {

    if (renderedCallback) {
      renderedCallback.bind(dlg)();
    }

    dlg.querySelector("eon-scroll").update();
  });
}

util.resetDlgOpenCallbacks = function (dlg) {
  util.resetCallback("onOpened", dlg);
  util.resetCallback("onOpenRendered", dlg);
}


function createPlaceHolder(text, imgUrl, title) {
  var node = document.createElement("div");
  var img = document.createElement("img");
  var textNode = document.createElement("div");

  img.src = imgUrl;
  textNode.innerHTML = text;

  node.classList.add("no-content");
  textNode.classList.add("no-content-text", "empty-fg");

  node.appendChild(img);

  if (title) {
    var titleNode = document.createElement("div");
    titleNode.classList.add("no-content-title", "empty-fg2");
    titleNode.innerHTML = title;
    node.appendChild(titleNode);
  }

  node.appendChild(textNode);
  return node;
}

function createPlaceHolderText(text) {
  var node = document.createElement("div");
  node.classList.add("place-holder");
  node.innerHTML = text;

  return node
}

function updatePathParams(url, params) {
  for (var key in params) {
    url = setParameterByName(key, params[key], url);
  }
  window.history.pushState({}, null, url);
}

function isEmpty(obj) {
  if (obj) {
    if (obj.constructor === Object) {
      return Object.getOwnPropertyNames(obj).length === 0;
    } else if (obj.constructor === Array) {
      return obj.length === 0;
    }
  } else {
    return true;
  }

  return false;
}

function weekdayName(n) {
  return moment.weekdays()[n];
}

function sortAlphabetically(key) {
  if (key) {
    return function (a, b) {
      var nameA = a[key].toLowerCase(),
        nameB = b[key].toLowerCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      }
      return 0;
    }
  }
}

// * Generic
function keysAsArray(obj) {
  var keys = [];

  if (obj.constructor == Object) {
    keys = Object.keys(obj);
  }

  return keys;
}

function toArray(obj) {
  var array = [];

  if (obj.constructor == Object) {
    for (var key in obj) {
      array.push(obj[key])
    }
  }

  return array;
}

function emailIsValid(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"À-ž]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email.trim()).toLowerCase());
}