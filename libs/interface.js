/**
 * Originally from the js design patterns book
 * @link http://jsdesignpatterns.com/
 * @constructor
 */
function Interface(name, methods) {
    if(arguments.length != 2) {
        throw new Error("Interface constructor called with "+arguments.length+
			" arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];
    for(var i = 0, len = methods.length; i < len; i++) {
        if(typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be "+
				"passed in as a string.");
        }
    }
	this.methods = methods;
};

Interface.ensureImplements = function(object) {
    if(arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
          arguments.length  + "arguments, but expected at least 2.");
    }

    for(var i = 1, len = arguments.length; i < len; i++) {
        var interf = arguments[i];
        if(interf.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects "+
				"arguments two and above to be instances of Interface.");
        }

        for(var j = 0, methodsLen = interf.methods.length; j < methodsLen; j++) {
            var method = interf.methods[j];
            if(!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object "+
					"does not implement the " + interf.name+
					" interface. Method " + method + " was not found.");
            }
        }
    }
};