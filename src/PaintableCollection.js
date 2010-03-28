/**
 * A array in which all entries should be unique and some extra methods
 * 
 * @constructor
 * @implements PaintableInterface
 * @param {Array} paintables
 */
function PaintableCollection(paintables) {
	if(paintables) {
		if(!(paintables instanceof Array)) {
			throw new TypeError("paintables should be an array");
		}
		paintables.forEach(function(item) {	this.push(item); }, this);
	}
};

// extend array
PaintableCollection.prototype = new Array();

/**
 * Pushes a paintable on the end of the collection
 * @param {PaintableInterface} paintable
 * @return {Number} New length of the collection
 */
PaintableCollection.prototype.push = function(paintable) {
	Interface.ensureImplements(paintable, PaintableInterface);
	if(this.contains(paintable)) {
		throw new Error("Paintable is already in collection");
	}
	return Array.prototype.push.call(this, paintable);
};

/**
 * Unshifts a paintable to the start of the collection
 * @param {PaintableInterface} paintable
 * @return {Number} New length of the collection
 */
PaintableCollection.prototype.unshift = function(paintable) {
	Interface.ensureImplements(paintable, PaintableInterface);
	if(this.contains(paintable)) {
		throw new Error("Paintable is already in collection");
	}
	return Array.prototype.unshift.call(this, paintable);
};

/**
 * Add a Paintable to the stack at the given position
 * @param {Number} position
 * @param {PaintableInterface} paintable
 */
PaintableCollection.prototype.addAt = function(position, paintable) {
	if(position.constructor !== Number) {
		throw new TypeError("position should be a Number");
	}
	Interface.ensureImplements(paintable, PaintableInterface);
	if(this.contains(paintable)) {
		throw new Error("Paintable is already in collection");
	}
	
	this.splice(position, 0, paintable);
};

/**
 * Add a Paintable before a given other paintable in the stack
 * @param {PaintableInterface} before
 * @param {PaintableInterface} paintable
 */
PaintableCollection.prototype.addBefore = function(before, paintable) {
	before = this.indexOf(before);
	if(before === -1) {
		throw new Error("Paintable to add before not found");
	}
	this.addAt(before, paintable);
};

/**
 * Add a Paintable after a given other paintable in the stack
 * @param {PaintableInterface} after
 * @param {PaintableInterface} paintable
 */
PaintableCollection.prototype.addAfter = function(after, paintable) {
	after = this.indexOf(after);
	if(after === -1) {
		throw new Error("Paintable to add after not found");
	}
	this.addAt(after+1, paintable);
};

/**
 * Removes a paintable
 * @param {PaintableInterface} paintable
 */
PaintableCollection.prototype.remove = function(paintable) {
	var i = this.indexOf(paintable);
	if(i === -1) {
		throw new Error("Paintable not found");
	}
	this.splice(i, 1);
};

/**
 * Tells if the collection contains the paintable
 * @param {PaintableInterface} paintable
 * @return bool
 */
PaintableCollection.prototype.contains = function(paintable) {
	return this.indexOf(paintable) !== -1;
};

/**
 * Runs the paint method on all paintables with the given arguments
 */
PaintableCollection.prototype.paint = function() {
	for(var i = 0, len = this.length; i < len; i++) {
		// TODO replace with a plain paint call when arguments are settled
		this[i].paint.apply(this[i], arguments);
	}
};
