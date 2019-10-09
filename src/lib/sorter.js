var customId = 0;

// @function process (private) [Sort tasks and output]
module.exports.process = function (config) {
    var sorted = {
        list: {
            sorted: {},
            unsorted: [],
            transformArray: {},
            before: {},
            after: {}
        },
        data: {},
        meta: {}
    };
    sortOutput(config, sorted);
    sortTask(config, sorted);
    processBefore(sorted);
    processAfter(sorted);
    return sorted;
};

// @function processBefore (private) [After all objects have been added, add wait for before items] @param sorted
function processBefore(sorted) {    
    for (key in sorted.list.before) {
        sorted.list.before[key].forEach(beforeItem => {
            if(!sorted.data[beforeItem]){
                throw new Error("Looking for an id that doesn't exists. Id: " + beforeItem);
            }
            sorted.data[beforeItem]._waitFor = sorted.data[beforeItem]._waitFor || [];
            sorted.data[beforeItem]._waitFor.push(key);
        });
    }
}
// @function processAfter (private) [After all objects have been added, add wait for after items] @param sorted
function processAfter(sorted) {
    for (key in sorted.list.after) {
        sorted.data[key]._waitFor = sorted.data[key]._waitFor || [];
        sorted.data[key]._waitFor = sorted.data[key]._waitFor.concat(sorted.list.after[key]);
    }
}

// @function sortTask (private) [Sort tasks] @param config @param sorted [Result object]
function sortTask(config, sorted) {    
    if ("tasks" in config) {
        Object.keys(config.tasks).forEach(element => {            
            sortTaskObject(config, config.tasks[element], element, sorted);
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
    } else {
        if ("before" in obj) {
            var waitFor = obj.before.split(" ");
            sorted.list.before[obj.id] = waitFor;
        } else if ("after" in obj) {
            var doAfter = obj.after.split(" ");
            sorted.list.after[obj.id] = doAfter;
        }
    }
    sorted.data[obj.id] = {
        status: "object",
        obj: obj
    };
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
        if ("before" in obj) {
            var waitFor = obj.before.split(" ");
            sorted.list.before[obj.id] = waitFor;
        } else if ("after" in obj) {
            var doAfter = obj.after.split(" ");
            sorted.list.after[obj.id] = doAfter;
        } else {
            var currentOrder = 0;
            sorted.list.sorted[currentOrder] = sorted.list.sorted[currentOrder] || [];
            sorted.list.sorted[currentOrder].push(obj.id);
            // sorted.list.unsorted.push(obj.id);
        }
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