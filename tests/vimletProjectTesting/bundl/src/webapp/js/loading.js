var mask = mask || {};

(function () {

  var self = this;
  self.viewMasks = {};

  self.timestamp = +new Date();
  self.__onHide = [];

  self.desc = self.desc || {};

  eon.createCallback("onMaskReady", self, "ready");

  document.addEventListener("DOMContentLoaded", function () {
    self.node = document.querySelector(".loading");
  });

  eon.onReady(function () {
    eon.triggerCallback("onMaskReady", self, self);
  });

  // API //
  var hideFn = function (threshold, delay) {
    var inst = this;
    // If the app loads after time threshold, do not apply the delay to the mask hide
    if (threshold) {
      if (+new Date() - self.timestamp < threshold) {
        setTimeout(function () {
          hideMask(inst);
        }, delay);
      } else {
        hideMask(inst);
      }
    } else {
      if (delay) {
        setTimeout(function () {
          hideMask(inst);
        }, delay);
      } else {
        hideMask(inst);
      }
    }
  }

  this.hide = hideFn.bind(self);

  this.hideViewMask = function (view) {
    var selector = "." + view + "-mask";
    views = document.querySelectorAll(selector);

    if (!isEmpty(views)) {
      for (var i = 0; i < views.length; i++) {
        views[i].classList.add("hide");
      }
    }
  }
  this.showViewMask = function (view) {
    var selector = "." + view + "-mask";
    views = document.querySelectorAll(selector);
 
    if (!isEmpty(views)) {
      for (var i = 0; i < views.length; i++) {
        views[i].classList.remove("hide");
      }
    }
  }

  var showFn = function () {
    showMask(this);
  }

  this.show = showFn.bind(self);

  function showMask(inst) {
    self.onMaskReady(function () {
      // // Check position
      // if (inst.node.isEqualNode(self.desc.node) && window.innerWidth >= 1470) {
      //   var menuWidth = Number(document.querySelector(".left-menu").offsetWidth);
      //   inst.node.style.width = "calc(100% - " + menuWidth + "px)";
      // }

      inst.node.classList.remove("fade-out");
      inst.node.classList.remove("hide");
    });
  }

  function hideMask(inst) {
    self.onMaskReady(function () {
      if (inst.node) {
        inst.node.classList.add("fade-out");
      }
      if (inst.triggerOnHide) {
        inst.triggerOnHide(inst);
      }

      setTimeout(function () {
        inst.node.classList.add("hide");
      }, 300);
    });
  }

  this.onHide = function (cb) {
    this.__onHide.push(cb);
  }

  this.triggerOnHide = function (inst) {
    var callbacks = this.__onHide;
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }
  }

}).apply(mask);