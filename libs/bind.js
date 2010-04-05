function bind(obj, func) {
	if(func.constructor === String) {
		func = obj[func];
	}
	return function() {
		return func.apply(obj, arguments);
	};
};