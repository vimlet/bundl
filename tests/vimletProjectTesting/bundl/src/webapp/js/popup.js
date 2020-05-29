var popup = popup || {};

// Displays a notification toast
popup.displayToast = function (message) {
  popup.toast = popup.toast || $1("#toast");

  popup.toast.innerHTML = message;
  popup.toast.classList.add("show");

  // Remove the "show" class after 3s (Time spent in animations)
  setTimeout(function () { 
    popup.toast.classList.remove("show"); 
    popup.innerHTML = "";
  }, 3000);
}

// Set title attributes to enable tooltips
popup.setupTooltips = function (node) {
  node = node || document;
  // Setup tooltips
  eon.onReady(function () {
    var nodes = node.$("[data-tooltip]");
    for (var i = 0; i < nodes.length; i++) {
      var btn = nodes[i];
      var tooltip = btn.dataset.tooltip;

      if (tooltip) {
        btn.setAttribute("title", eon.locale.global.tooltip[tooltip]);
      }
    };
  });
}