var client_render = client_render || {
  viewSelector: ".view-render",
  hrefSelector: ".view-href"
};

(function () {
  var self = this;

  this._isMatch = function (s, patterns, options) {
    options = options || {};
    options.caseSensitive = options.caseSensitive ? "" : "i";

    patterns = typeof patterns === "string" ? [patterns] : patterns;

    // Use stored filtered patterns to avoid filtering more than once
    var negatePatterns;
    if ("negatePatterns" in options) {
      patterns = options.patterns;
      negatePatterns = options.negatePatterns;
    } else {
      var filtered = this._filterPatterns(patterns);
      patterns = filtered[0];
      negatePatterns = filtered[1];
    }

    // Check if match with pattern
    for (var i = 0; i < patterns.length; i++) {
      if (s.match(new RegExp("^" + this._patternToRegex(patterns[i]) + "$"), options.caseSensitive)) {
        // Check if match with negate pattern
        for (var j = 0; j < negatePatterns.length; j++) {
          if (s.match(new RegExp("^" + this._patternToRegex(negatePatterns[j]) + "$"), options.caseSensitive)) {
            return null;
          }
        }
        return patterns[i];
      }
    }
    return null;
  };

  this._escapeRegExp = function (s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  };

  this._patternToRegex = function (s) {
    s = this._escapeRegExp(s);
    s = s.replace(/\\\*\\\*/g, ".*");
    s = s.replace(/[^\.]\*/g, "[^/]*");
    return s;
  };

  this._filterPatterns = function (patterns) {
    var negatePatterns = [];
    var pattern;
    for (var i = patterns.length - 1; i >= 0; i--) {
      pattern = patterns[i];
      if (pattern.indexOf("!") == 0) {
        negatePatterns.push(patterns.pop(i).substr(1));
      }
    }
    return [patterns, negatePatterns];
  };

  this._toggleContent = function (view) {
    var views = document.querySelectorAll(client_render.viewSelector);
    for (var i = 0; i < views.length; i++) {
      var el = views[i];

      if (!this._isMatch(view, el.dataset.view)) {
        el.style.display = "none";
      } else {
        this._importContent(el, function (storedEl) {
          storedEl.style.display = "flex";
          self.triggerOnViewChanged(view);
        });
      }
    }
  };

  this._importContent = function (el, callback) {
    if (el.dataset.imported != "true") {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          el.setAttribute("data-imported", "true");
          var fragment = document.createRange().createContextualFragment(xhttp.responseText);
          el.appendChild(fragment);
          if (callback) {
            callback(el);
          }
        }
      };
      xhttp.open("GET", el.dataset.path, true);
      xhttp.send();
    } else {
      if (callback) {
        callback(el);
      }
    }
  };

  this.view = function (view) {
    var self = this;
    var el = document.querySelector("[data-view='" + view + "']");

    window.history.pushState({
      view: view
    }, null, view);

    self._toggleContent(view);
  }; 

  this.overrideHrefs = function () {
    var self = this;
    var buttons = document.querySelectorAll(client_render.hrefSelector);
    for (var i = 0; i < buttons.length; i++) {
      var el = buttons[i];
      if (!el._overrided) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          var href = this.getAttribute("href") || this.getAttribute("data-href");
          self.view(href);
        });
        el._overrided = true;
      }
    }
  };

  this.__onViewChanged = [];

  this.onViewChanged = function(cb){
    this.__onViewChanged.push(cb);
  }

  this.triggerOnViewChanged = function(view){
    var callbacks = this.__onViewChanged;
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](view);
    }
  }

  this.onViewChanged = function(cb){
    this.__onViewChanged.push(cb);
  }

  this.triggerOnViewChanged = function(view){
    var callbacks = this.__onViewChanged;
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](view);
    }
  }

  // Add state listener
  window.addEventListener("popstate", function (e) {
    if (e.state && e.state.view) {
      self._toggleContent(e.state.view);
    }
  });

  // Initialize state
  window.history.pushState({
    view: window.location.href
  }, null, window.location.href);

  // Override hrefs
  document.addEventListener("DOMContentLoaded", function () {
    client_render.overrideHrefs();
  });

}).apply(client_render);


