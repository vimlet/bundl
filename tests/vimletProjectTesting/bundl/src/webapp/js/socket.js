var socket = socket || {};
eon.createCallback("onSocket_notification", socket);

// function initSockets() {
// app.notificationUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;

//   app.socket = io.connect(app.notificationUrl);

//   socket.listen();
// }

eon.createCallback("onSocketTask", socket);
eon.createCallback("onSocketTaskDeleted", socket);
eon.createCallback("onSocketBoard", socket);
eon.createCallback("onSocketBoardDeleted", socket);
eon.createCallback("onSocketLog", socket);
eon.createCallback("onSocketLogDeleted", socket);


socket.listen = function () {
  app.socket.on("notification", function (socketData) { // TODO this could be done using callbacks
    var urlPath = window.location.pathname.split("/");
    if (urlPath && urlPath.indexOf("notifications") < 0) {
      switch (socketData.action) {
        case "create":
          notification.new();
          break;
      }
    }
  });

  app.socket.on("task", function (socketData) {
    task.get(socketData.id, function (error, taskData) {
      if (!error) {
        eon.triggerCallback("onSocketTask", socket, socket, [taskData]);
      }else{
        eon.triggerCallback("onSocketTaskDeleted", socket, socket, [socketData.id]);
      }
    });
  });

  app.socket.on("board", function (socketData) {
    board.get(socketData.id, function (error, boardData) {
      if (!error) {
        eon.triggerCallback("onSocketBoard", socket, socket, [boardData]);
      } else {
        eon.triggerCallback("onSocketBoardDeleted", socket, socket, [socketData.id]);
      }
    });
  });

  app.socket.on("log", function (socketData) {
    log.get(socketData.id, function (error, logData) {
      if (!error) {
        eon.triggerCallback("onSocketLog", socket, socket, [logData]);
      } else {
        eon.triggerCallback("onSocketLogDeleted", socket, socket, [socketData.id]);
      }
    });
  });


}