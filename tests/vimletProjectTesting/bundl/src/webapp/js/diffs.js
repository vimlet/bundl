var differ = differ || {};


// @function _compare (public) [Compare to objects and return differences] @param options [arrayOrder: if set to true, the arrays will only be equals if they have the same order]
differ.compare = function (obj1, obj2, options) {
  options = options || {};
  var diffs = {};
  obj1 = JSON.parse(JSON.stringify(obj1));
  obj2 = JSON.parse(JSON.stringify(obj2));
  for (var key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      compareEntry(obj1[key], obj2[key], key, diffs, options);
    }
  }
  for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }
  return diffs;
}

// @function compareEntry (private) [Compare to object entries]
function compareEntry(item1, item2, key, diffs, options) {
  var type1 = Object.prototype.toString.call(item1);
  var type2 = Object.prototype.toString.call(item2);
  if (type2 === '[object Undefined]') {
    diffs[key] = null;
    return;
  }
  if (type1 !== type2) {
    diffs[key] = item2;
    return;
  }
  if (type1 === '[object Object]') {
    var objDiff = differ.compare(item1, item2, options);
    if (Object.keys(objDiff).length > 0) {
      diffs[key] = objDiff;
    }
    return;
  }
  if (type1 === '[object Array]') {
    if (!compareArray(item1, item2, options)) {
      diffs[key] = item2;
    }
    return;
  }
  if (type1 != '[object Function]') {
    if (item1 !== item2) {
      diffs[key] = item2;
    }
  }
}
// @function compareArray (private) [Compare arrays] @param arr1 @param arr2 @param options
function compareArray(arr1, arr2, options) {
  // arr1 = JSON.parse(JSON.stringify(arr1));
  // arr2 = JSON.parse(JSON.stringify(arr2));
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (var i = 0; i < arr1.length; i++) {
    if (options.arrayOrder) {
      if (!arr2[i] || arr2[i] != arr1[i]) {
        return false;
      }
    } else {
      var element = arr1[i];
      var index2 = arr2.indexOf(element);
      if (index2 < 0) {
        return false;
      } else {
        arr2.splice(index2, 1);
      }
    }
  }
  if (!options.arrayOrder && arr2.length > 0) {
    return false;
  }
  return true;
}