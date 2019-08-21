var customId = 0;

// @function sortOutput (public) [Sort output object]
module.exports.sortOutput = function (config) {
    var status = {};
    var list = {
        sorted: {},
        unsorted: [],
        transformArray: {},
        before: [],
        after: []
    };
    Object.keys(config.output).forEach(element => {
        if (typeof config.output[element] === 'object' && !Array.isArray(config.output[element])) {
            sortOutputObject(config, config.output[element], element, status, list);
        } else if (Array.isArray(config.output[element])) {
            sortOutputArray(config, config.output[element], element, status, list);
        } else {
            sortOutputString(config, config.output[element], element, status, list);
        }
    });
    return {
        list: list,
        data: status
    };
};


// @function sortOutputObject (private) [Sort output key where it is an object] @param config @param obj @param element [Output key] @param status [Object which stores output object and status.]@param list [List with sorted and unsorted objects]
function sortOutputObject(config, obj, element, status, list) {
    obj.id = obj.id || getCustomId();
    obj.outPath = element;
    if ("order" in obj) {
        var currentOrder = parseInt(obj.order);
        list.sorted[currentOrder] = list.sorted[currentOrder] || [];
        list.sorted[currentOrder].push(obj.id);
        status[obj.id] = {
            status: "object",
            obj: obj
        };
    } else {


        if ("before" in obj) {
            // sortBefore(config, obj, key, before, unsorted);
        } else if ("after" in obj) {
            // after.push(obj);
        } else {
            list.unsorted.push(obj.id);
            status[obj.id] = {
                triggered: "object",
                obj: obj
            };
        }



    }
    return obj;
}



// @function sortOutputArray (private) [Sort output key where it is an array] @param config @param obj @param element [Output key] @param status [Object which stores output object and status.]@param list [List with sorted and unsorted objects]
function sortOutputArray(config, obj, element, status, list) {
    var isCopy = element.endsWith("**");
    if (isCopy) {
        obj.forEach(currentObject => {
            sortOutputObject(config, currentObject, element, status, list);
        });
    } else {
        list.transformArray[element] = [];
        obj.forEach(currentObject => {            
            var currentO = sortOutputObject(config, currentObject, element, status, list, true);
            list.transformArray[element].push(currentO.id);
        });


        //   var tId = 0;
        //   obj.forEach(currentObject => {
        //     if (!currentObject.id) {
        //       currentObject.id = "_" + tId;
        //       tId++;
        //     }
        //     currentObject._waitTransform = element;
        //     transformArrays[element] = transformArrays[element] || {
        //       position: [],
        //       promises: []
        //     };
        //     transformArrays[element].position.push(currentObject.id);
        //     sortOutputObject(config, currentObject, element, status, list);
        //   });


    }
}

// @function sortOutputString (private) [Sort output key where it is an string] @param config @param obj @param element [Output key] @param status [Object which stores output object and status.]@param list [List with sorted and unsorted objects]
function sortOutputString(config, obj, element, status, list) {
    var current = {};
    current.outPath = element;
    current.input = obj;
    current.id = getCustomId();
    list.unsorted.push(current.id);
    status[current.id] = {
        triggered: "object",
        obj: current
    };
}


// @function getCustomId (private) [Get an id to identify an output without id]
function getCustomId() {
    var current = "__" + customId;
    customId++;
    return current;
}