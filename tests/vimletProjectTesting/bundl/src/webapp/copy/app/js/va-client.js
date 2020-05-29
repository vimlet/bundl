var va = va || {
  url: "/va"
};

(function () {

  // --- Private ---
  function sendJson(payload) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Do nothing
      }
    };
    req.open("POST", va.url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Alt-Referer", document.referrer);
    req.send(JSON.stringify(payload));

  }

  function isInViewport(el) {
    var bounding = el.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // --- Public ---
  this.sendPageView = function (pageview, hostname, title, params) {
    sendJson({
      type: "pageview",
      pageview: pageview,
      hostname: hostname,
      title: title,
      params: params,
      campaignName: getParameterByName("utm_campaign"),
      campaignSource: getParameterByName("utm_source"),
      campaignMedium: getParameterByName("utm_medium"),
      campaignKeyword: getParameterByName("utm_term"),
      campaignContent: getParameterByName("utm_content"),
      campaignId: getParameterByName("utm_campaign"),
      googleAdwordsId: getParameterByName("gclid"),
      loadTime: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart
    });
  };

  this.sendScreenView = function (screenName, appName, appVersion, appId, appInstallerId, params) {
    sendJson({
      type: "screenview",
      screenName: screenName,
      appName: appName,
      appVersion: appVersion,
      appId: appId,
      appInstallerId: appInstallerId,
      params: params
    });
  };

  this.sendEvent = function (category, action, label, value, params) {
    sendJson({
      type: "event",
      category: category,
      action: action,
      label: label,
      value: value,
      params: params
    });
  };

  this.sendException = function (description, fatal, params) {
    sendJson({
      type: "exception",
      description: description,
      fatal: fatal,
      params: params
    });
  };

  this.sendTiming = function (category, variable, time, label, params) {
    sendJson({
      type: "timing",
      category: category,
      variable: variable,
      time: time,
      label: label,
      params: params
    });
  };

  this.sendTransaction = function (transactionId, revenue, shippingCost, tax, affiliation, params) {
    console.log("sendTransaction not implemented! ");
  };

  // --- Interaction handlers ---

  this.handleClick = function (selector, fn) {
    var el = document.querySelector(selector);
    if(el) {
      el.addEventListener("click", function () {
        fn();
      });
    }
  };

  // TODO: support nested viewports and other detection methods
  this.handleViewport = function (selector, fn) {
    var el = document.querySelector(selector);
    if (!("viewInteractionItems" in window)) {
      window.viewInteractionItems = [];
      setInterval(function () {
        for (var i = 0; i < window.viewInteractionItems.length; i++) {
          var current = window.viewInteractionItems[i];
          if (isInViewport(current.el)) {
            current.fn();
            window.viewInteractionItems.splice(i, 1);
          }
        }
      }, 1000);
    }

    if (el) {
      window.viewInteractionItems.push({
        el: el,
        fn: fn
      });
    }
  };

}).apply(va);

