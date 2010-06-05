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

