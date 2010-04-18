/**
 * ObjectPool for the recycling of objects
 *
 * Classes with a short livespan benefit from this, it reuses
 * objects instead of generating new ones each time and having the
 * garbage collector cleaning up all unreferenced old objects
 * @param {Function} objectClass Constructor of the host class
 * @return void
 */
WebZed.ObjectPool = function (objectClass) {
	if (!(objectClass instanceof Function)) {
		throw new TypeError("objectClass should be of type Function");
	}

	this.objectClass = objectClass;
	this.pool = [];
};

/**
 * Returns a objectClass instance either recycling an old one or creating
 * a new one if no old instances are available
 * @param [argN] any args passed to the object constructor
 * @return {Object} Object of type objectClass
 */
WebZed.ObjectPool.prototype.create = function () {
	var obj;
	if (this.pool.length) {
		obj = this.pool.pop();
		this.objectClass.apply(obj, arguments);
	}
	else {
		obj = this.createNew(arguments);
	}
	
	obj.active = true;
	return obj;
};

/**
 * Creates a new objectClass instance
 * @param {Array} args
 * @return {Object} new instance of type objectClass
 */
WebZed.ObjectPool.prototype.createNew = function (args) {
	// there is no way to do a new SomeClass with an array
	// as arguments so we create a function to do just that
	for (var argParams = [], i = 0, len = args.length; i < len; i += 1) {
		argParams.push("a[" + i + "]");
	}
	
	return (new Function("c", "a",
		"return new c(" + argParams.join(",") + ");")(this.objectClass, args));
};

/**
 * Recycle a object putting it in the pool to be used for a next create call
 * @param {Object} obj Object to recycle
 * @param {Bool}strip
 * @return void
 */
WebZed.ObjectPool.prototype.recycle = function (obj, strip) {
	if (!obj.active) {
		throw new Error("Object is already recycled");
	}
	if (strip) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				delete obj[prop];
			}
		}
	}
	obj.active = false;
	this.pool.push(obj);
};

/**
 * Augment the objectClass with a create and recycle method
 * @return void
 */
WebZed.ObjectPool.prototype.augment = function () {
	var pool = this;
	this.objectClass.create = WebZed.bind(this, "create");
	this.objectClass.prototype.recycle = function (strip) {
		pool.recycle(this, strip);
	};
};
