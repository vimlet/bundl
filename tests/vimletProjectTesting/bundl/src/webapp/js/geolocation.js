var app = app || {};
app.timestamp = +new Date();

app.location = function (cb) {

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    var data = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy
    };
    cb(null, data);
  };

  function error(err) {
    cb(error);
    // TODO Dialog Please enable GPS!
    // alert('ERROR(' + err.code + '): ' + err.message);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

// function (private) _requestLocationPermission
app.requestLocationPermission = function (cb) {
  app.locationDlg = document.querySelector("#location-dialog");
  app.locationDlgMask = document.querySelector(".location-dialog-mask");

  var hideMask = function() {
    eon.onReady(function(){
      app.locationDlgMask.classList.remove("visible-flex");
      app.locationDlg.close();
    });
  }
  var showDlg = function() {
    eon.onReady(function(){
      // Show green mask
      app.locationDlgMask.classList.add("visible-flex");
      app.locationDlg.open();
      // Push dialog state
      pushDialogState(app.locationDlg);

      app.location(function(error, data){
        if(!error) {
          hideMask();
        }
      });
    });
  }

  // Request for location permission
  var requestPermission = function(result) {
    if (result.state == "prompt" || result.state == "denied") {
      showDlg();
    } else {
      hideMask();
      if(cb) {
        cb();
      }
    }
  } 

  // Check browser geolocation service 
  if(!navigator.geolocation) {
    // Denied using the application
    showDlg();
    
  } else {
    // ** SAFARI FIX
    if(eon.util.getBrowser() == "Safari" || eon.util.getBrowser() == "Edge") {
      // Force request permission
      navigator.geolocation.getCurrentPosition(function(arg){
        hideMask();

        if(cb) {
          cb();
        }
      }, function(arg){
        showDlg();
      });
    } else {
      
      // Check current permission
      navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
        requestPermission(result);
    
        result.onchange = function(){
          requestPermission(result);
        }
      });
    }
  }

}

