var app = app || {};
app.export = app.export || {};
app.export.members = [];
app.export.counter = 0;
app.export.lock = false;

app.export.exportPDFFile = function (data, date, fileTitle, endCallback) {
  if(!app.export.lock) {
    app.export.lock = true;
  
    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'portrait' });
    var workspaceName = session.data.workspaces[session.data.currentWorkspaceId].name;
    doc.reportData = { name: workspaceName, date: date };
    var y = 12;
  
    y = app.export.addHeader(doc, y);
  
    app.export.members = data.entries.length;
  
    for (var i = 0; i < data.entries.length; i++) {
      var report = data.entries[i];
      y += 3;
      // REPEAT FOR EACH MEMBER
      y = app.export.createPDFUser(doc, report, y);
      y = app.export.createPDFResume(doc, report, y);
      y = app.export.createPDFRegistries(doc, report, data.registryHeaders, y);
  
      y = doc.lastCellPos.y;
      y += 15;
    }
  
    // Add last page footer
    app.export.addFooter(doc);
  
    app.export.onImagesLoaded(function(){
  
      app.export.counter++;

      if(app.export.counter == app.export.members) {
        app.export.counter = 0
        // Reset callbacks
        app.export.resetCallbacks();

        doc.save(fileTitle + ".pdf", {returnPromise: true}).then(function(){
          if(endCallback) {
            endCallback();
          }
          // Lock the next download until 500 ms
          setTimeout(function() {
            app.export.lock = false;
          }, 500);
        });
        
      }
    });
  }
}

app.export.createPDFUser = function (doc, report, y) {
  // CHECK PAGE LIMIT
  y = app.export.pageReached(doc, y);
  doc.setFontSize(12);

  y += 15;
  
  // Get image from url
  var url = "/rest/user/avatar/" + report.mail;

  var image = new Image();
  image.style.borderRadius = "20px";

  var imgPage = doc.internal.pages.length - 1;
  var imgYPosition = y;

  // Image found
  image.onload = function () {

    // Paint image circle boundaries
    imgYPosition -= 7;

    var canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

    var ctx = canvas.getContext("2d");
    ctx.arc(62, 62, 62, 0, Math.PI * 2, true);
    ctx.clip();

    ctx.drawImage(this, 0, 0);

    // Get as Data URI
    var myImage = canvas.toDataURL("image/png");
    
    doc.setPage(imgPage);
    // Paint image loaded
    doc.addImage(myImage, "PNG", 10, imgYPosition, 16, 16);
    app.export.triggerOnImagesLoaded();
  };

  // Image loading error
  image.onerror = function(){
    doc.setPage(imgPage);
    // Paint the avatar placeholder
    doc.setDrawColor(128, 128, 128);
    doc.circle(18, imgYPosition, 8);
    app.export.triggerOnImagesLoaded();
  }

  image.src = url;

  doc.text(report.alias, 30, y);
  doc.setFontSize(12);
  doc.setTextColor(128, 128, 128);

  y += 5;
  doc.text(report.mail, 30, y);
  doc.setTextColor(0, 0, 0);

  return y;
}

app.export.createPDFResume = function (doc, report, y) {
  doc.setLineHeightFactor(0.5);
  doc.setLineWidth(7);
  doc.setDrawColor(56, 198, 187);

  y += 15;
  doc.line(10, y, 200, y);
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);

  y += 1.5;
  doc.text(eon.locale.report.pdfSummary, 12, y);
  doc.text(eon.locale.report.pdfTotalWorked, 125, y);
  doc.text(eon.locale.report.pdfTotalExtras, 165, y);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  y += 8.5;
  doc.text(report.total, 126, y);
  doc.text(report.extra, 166, y);
  doc.setLineWidth(0.3);

  y += 4;
  doc.line(10, y, 200, y);
  // CHECK PAGE LIMIT
  y = app.export.pageReached(doc, y);

  return y;
}

app.export.createPDFRegistries = function (doc, report, headers, y) {
  doc.setFontSize(12);
  doc.setFillColor("#8c27cf");
  doc.setDrawColor(220, 220, 220);
  doc.setLineHeightFactor(1);

  y += 10;
  doc.text(eon.locale.report.registries, 10, y);
  var formattedRegistryHeaders = app.export.getPDFHeaders(headers, "registry");
  var alias = report.alias;
  var aliasSplit = alias.split(" ");

  // Get last name initial letters
  if (aliasSplit[1]) {
    alias = aliasSplit[0] + " " + aliasSplit[1].substring(0, 1) + ".";
    alias = aliasSplit[2] ? alias + aliasSplit[2].substring(0, 1) + "." : alias;
  }
  var formattedRegistryItems = app.export.getPDFRegistryItems(report.registries, alias);

  y += 5;
  doc.table(10, y, formattedRegistryItems, formattedRegistryHeaders, { fontSize: 10, headerBackgroundColor: "#8c27cf" });

  return y;
}

app.export.getPDFHeaders = function (keys, type) {
  var builtHeaders = [];
  var formattedItem = {};
  var width = 60;

  for (var i = 0; i < keys.length; i++) {
    formattedItem = {
      id: keys[i].id,
      name: keys[i].id,
      prompt: keys[i].name,
      width: width,
      align: "center",
      padding: 0
    }

    if (keys[i].id == "alias") {
      formattedItem.width = 60;
    } else if (~["worked", "extras"].indexOf(keys[i].id)) {
      formattedItem.width = 35;
    }

    builtHeaders.push(formattedItem);
  }

  return builtHeaders;
}

app.export.getPDFReportItems = function (items) {
  var builtItems = [];

  for (var i = 0; i < items.length; i++) {
    builtItems.push({
      alias: items[i].alias,
      user: items[i].mail,
      total: items[i].total,
      extras: items[i].extra
    });
  }
  return builtItems;
}
app.export.getPDFRegistryItems = function (items, alias) {
  var builtItems = [];
  var entryMoment, exitMoment;

  for (var i = 0; i < items.length; i++) {
    entryMoment = moment(items[i].entryISO, util.isoFormat);
    exitMoment = moment(items[i].exitISO, util.isoFormat);

    // Format dates
    // TODO - locale sensitive
    builtItems.push({
      alias: alias,
      entry: entryMoment.format("DD/MM/YY") + "   " + entryMoment.format("HH[h] mm[m]"),
      exit: exitMoment.format("DD/MM/YY") + "   " + exitMoment.format("HH[h] mm[m]"),
      extras: !items[i].extra ? "--" : moment.duration(items[i].extra, "milliseconds").format("hh[h] mm[m]", { trim: false }),
      worked: !items[i].worked ? "--" : moment.duration(items[i].worked, "milliseconds").format("hh[h] mm[m]", { trim: false })
    });

    // Format events
    for (var key in items[i].events) {
      var evt = items[i].events[key];

      var brkEntryMoment = moment(evt.entryISO, util.isoFormat);
      var brkExitMoment = moment(evt.exitISO, util.isoFormat);

      builtItems.push({
        alias: "--------",
        entry: brkEntryMoment.format("DD/MM/YY") + "   " + brkEntryMoment.format("HH[h] mm[m]"),
        exit: brkExitMoment.format("DD/MM/YY") + "   " + brkExitMoment.format("HH[h] mm[m]"),
        extras: "",
        worked: ""
      });
    } 
  }

  return builtItems;
}

app.export.exportCSVFile = function (data, date, fileTitle, endCallback) {
  if(!app.export.lock) {
    app.export.lock = true;
    data.reportData = date;
  
    var csv = this.convertToCSV(data);
  
    var exportedFilename = fileTitle + ".csv" || "export.csv";
  
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, exportedFilename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    if(endCallback) {
      endCallback();
    }
    app.export.lock = false;
  }
}

app.export.convertToCSV = function (data) {
  var members = data.entries;
  var monthlyHeaders = [];
  var registryHeaders = [];
  var registries = [];

  var str = "";

  for (var i = 0; i < data.monthlyHeaders.length; i++) {
    monthlyHeaders.push(data.monthlyHeaders[i].name);
  }
  for (var i = 0; i < data.registryHeaders.length; i++) {
    registryHeaders.push(data.registryHeaders[i].name);
  }

  // FOR members
  for (var key in members) {
    var member = members[key];
    // Add monthly summary headers
    str += monthlyHeaders + "\r\n";
    // TODO - Add user full name before alias
    str += member.alias + "," + member.total + "," + member.extra + "\r\n";
 
    str += registryHeaders + "\r\n";
    var registries = app.export.getCSVRegistryItems(member.registries, member.alias);
    for (var i = 0; i < registries.length; i++) {
      registry = registries[i];
      str += registry.alias + "," + registry.entry + "," + registry.exit + "," + registry.worked + "," + registry.extras + "\r\n";
    }
  }
  return str;
}
app.export.getCSVRegistryItems = function (items, alias) {
  var builtItems = [];
  var entryMoment, brkExitMoment;

  for (var i = 0; i < items.length; i++) {
    entryMoment = moment(items[i].entryISO, util.isoFormat);
    exitMoment = moment(items[i].exitISO, util.isoFormat);
    
    builtItems.push({
      alias: alias,
      entry: entryMoment.format("DD/MM/YY") + "   " + entryMoment.format("HH[h] mm[m]"),
      exit: exitMoment.format("DD/MM/YY") + "   " + exitMoment.format("HH[h] mm[m]"),
      extras: !items[i].extra ? "--" : moment.duration(items[i].extra, "milliseconds").format("hh[h] mm[m]", { trim: false }),
      worked: !items[i].worked ? "--" : moment.duration(items[i].worked, "milliseconds").format("hh[h] mm[m]", { trim: false })
    });

    // Format events
    for (var key in items[i].events) {
      var evt = items[i].events[key];

      var brkEntryMoment = moment(evt.entryISO, util.isoFormat);
      var brkExitMoment = moment(evt.exitISO, util.isoFormat);

      builtItems.push({
        alias: "",
        entry: brkEntryMoment.format("DD/MM/YY") + "   " + brkEntryMoment.format("HH[h] mm[m]"),
        exit: brkExitMoment.format("DD/MM/YY") + "   " + brkExitMoment.format("HH[h] mm[m]"),
        extras: "",
        worked: ""
      });
    } 
  }
  return builtItems;
}
app.export.pageReached = function (doc, y) {
  var pageHeight = doc.internal.pageSize.height;
  // Before adding new content
  if (y + 60 >= pageHeight) {
    // Add pager header
    app.export.addFooter(doc);

    doc.addPage();
    y = 12 // Restart height position
    // Add pager header
    app.export.addHeader(doc, y);
  }
  return y;
}

app.export.addHeader = function (doc, y) {
  doc.setFontSize(11);
  doc.text(doc.reportData.name + " - " + eon.locale.report.pdfTitle, 10, y);
  doc.text(eon.locale.report.pdfDate + ":  " + doc.reportData.date, doc.internal.pageSize.width - 59, y);
  return y;
}
app.export.addFooter = function (doc) {
  doc.setFontSize(11);
  doc.text((doc.internal.pages.length - 1).toString(), doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 10);
}

app.export.format = function (array) {
  var formatted = [];

  // Remove commas to avoid errors
  array.forEach(function (item) {
    var formattedItem = {};
    for (var key in item) {
      formattedItem[key] = item[key].replace(/,/g, '');
    }

    formatted.push(formattedItem);
  });

  return formatted;
}

app.export.onImagesLoaded = function(cb){
  app.export._onImagesLoaded = app.export._onImagesLoaded || [];
  app.export._onImagesLoaded.push(cb)
}
app.export.resetCallbacks = function(cb){
  app.export._onImagesLoaded = [];
}

app.export.triggerOnImagesLoaded = function(){
  app.export._onImagesLoaded = app.export._onImagesLoaded || [];
  for (var i = 0; i < app.export._onImagesLoaded.length; i++) {
    var cb = app.export._onImagesLoaded[i];
    cb();
  }
}