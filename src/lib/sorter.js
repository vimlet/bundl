var customId = 0;

// @function process (private) [Sort tasks and output]
module.exports.process = function (config) {
    var sorted = {
        list: {
            sorted: {},
            unsorted: [],
            transformArray: {},
            before: [],
            after: []
        },
        data: {}
    };
    sortOutput(config, sorted);
    sortTask(config, sorted);
    return sorted;
};

// @function sortTask (private) [Sort tasks] @param config @param sorted [Result object]
function sortTask(config, sorted) {
    if ("task" in config) {        
        Object.keys(config.task).forEach(element => {
            sortTaskObject(config, config.task[element], element, sorted);
        });
    }
}

// @function sortTaskObject (private) [Sort task key] @param config @param obj @param element [Output key] @param sorted [Result object]
function sortTaskObject(config, obj, element, sorted) {
    obj.id = element;
    obj._type = "task";    
    if ("order" in obj) {        
        var currentOrder = parseInt(obj.order);
        sorted.list.sorted[currentOrder] = sorted.list.sorted[currentOrder] || [];
        sorted.list.sorted[currentOrder].push(obj.id);
        sorted.data[obj.id] = {
            status: "object",
            obj: obj
        };
    } else {
        sorted.list.unsorted.push(obj.id);
        sorted.data[obj.id] = {
            status: "object",
            obj: obj
        };
    }
    return obj;
}

// @function sortOutput (private) [Sort output object] @param config @param sorted [Result object]
function sortOutput(config, sorted) {
    if ("output" in config) {
        Object.keys(config.output).forEach(element => {
            if (typeof config.output[element] === 'object' && !Array.isArray(config.output[element])) {
                sortOutputObject(config, config.output[element], element, sorted);
            } else if (Array.isArray(config.output[element])) {
                sortOutputArray(config, config.output[element], element, sorted);
            } else {
                sortOutputString(config, config.output[element], element, sorted);
            }
        });
    }
}

// @function sortOutputObject (private) [Sort output key where it is an object] @param config @param obj @param element [Output key] @param sorted [Result object]
function sortOutputObject(config, obj, element, sorted) {
    obj.id = obj.id || getCustomId();
    obj.outPath = element;
    obj._type = element.endsWith("**") ? "copy" : "transform";
    if ("order" in obj) {
        var currentOrder = parseInt(obj.order);
        sorted.list.sorted[currentOrder] = sorted.list.sorted[currentOrder] || [];
        sorted.list.sorted[currentOrder].push(obj.id);
    } else {
        // if ("before" in obj) {
        //     // sortBefore(config, obj, key, before, unsorted);
        // } else if ("after" in obj) {
        //     // after.push(obj);
        // } else {
        //     sorted.list.unsorted.push(obj.id);
        //     sorted.data[obj.id] = {
        //         status: "object",
        //         obj: obj
        //     };
        // }
        sorted.list.unsorted.push(obj.id);
    }
    sorted.data[obj.id] = {
        status: "object",
        obj: obj
    };
    return obj;
}



// @function sortOutputArray (private) [Sort output key where it is an array] @param config @param obj @param element [Output key] @param sorted [Result object]
function sortOutputArray(config, obj, element, sorted) {
    var isCopy = element.endsWith("**");
    if (isCopy) {
        obj.forEach(currentObject => {
            sortOutputObject(config, currentObject, element, sorted);
        });
    } else {
        sorted.list.transformArray[element] = [];
        obj.forEach(currentObject => {
            var currentO = sortOutputObject(config, currentObject, element, sorted, true);
            sorted.list.transformArray[element].push(currentO.id);
        });
    }
}

// @function sortOutputString (private) [Sort output key where it is an string] @param config @param obj @param element [Output key] @param sorted [Result object]
function sortOutputString(config, obj, element, sorted) {
    var current = {};
    current.outPath = element;
    current.input = obj;
    current.id = getCustomId();
    current._type = element.endsWith("**") ? "copy" : "transform";
    sorted.list.unsorted.push(current.id);
    sorted.data[current.id] = {
        status: "object",
        obj: current
    };
}


// @function getCustomId (private) [Get an id to identify an output without id]
function getCustomId() {
    var current = "__" + customId;
    customId++;
    return current;
}