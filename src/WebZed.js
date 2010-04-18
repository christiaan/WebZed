WebZed.bind = function (obj, func) {
	if(func.constructor === String) {
		func = obj[func];
	}
	if(!(func instanceof Function)) {
		throw new TypeError("func should be a Function");
	}
	return function() {
		return func.apply(obj, arguments);
	};
};
/**
 * Originally from the js design patterns book
 * @link http://jsdesignpatterns.com/
 * @constructor
 */
WebZed.Interface = function (name, methods) {
    if (arguments.length !== 2) {
        throw new Error("Interface constructor called with "+arguments.length+
			" arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i += 1) {
        if (typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be "+
				"passed in as a string.");
        }
    }
	this.methods = methods;
};

WebZed.Interface.ensureImplements = function(object) {
	var i, interf, j, method;
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
          arguments.length  + "arguments, but expected at least 2.");
    }

    for (i = 1; i < arguments.length; i += 1) {
        interf = arguments[i];
        if (interf.constructor !== WebZed.Interface) {
            throw new Error("Function Interface.ensureImplements expects "+
				"arguments two and above to be instances of Interface.");
        }

        for (j = 0; j < interf.methods.length; j += 1) {
            method = interf.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new TypeError("Function Interface.ensureImplements: object "+
					"does not implement the " + interf.name+
					" interface. Method " + method + " was not found.");
            }
        }
    }
};
