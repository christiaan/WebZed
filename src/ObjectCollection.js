/**
 * A array in which all entries should be unique and some extra methods
 * 
 * @constructor
 * @param {Array} items
 */
function ObjectCollection(items) {
	if(items) {
		if(!(items instanceof Array)) {
			throw new TypeError("items should be an array");
		}
		items.forEach(function(item) {	this.push(item); }, this);
	}
};

// extend array
ObjectCollection.prototype = new Array();

/**
 * Pushes a item to the end of the collection
 * @param {Object} item
 * @return {Number} New length of the collection
 */
ObjectCollection.prototype.push = function(item) {
	if(this.contains(item)) {
		throw new Error("item is already in collection");
	}
	return Array.prototype.push.call(this, item);
};

/**
 * Unshifts a item to the start of the collection
 * @param {Object} item
 * @return {Number} New length of the collection
 */
ObjectCollection.prototype.unshift = function(item) {
	if(this.contains(item)) {
		throw new Error("item is already in collection");
	}
	return Array.prototype.unshift.call(this, item);
};

/**
 * Add a item to the stack at the given position
 * @param {Number} position
 * @param {Object} item
 */
ObjectCollection.prototype.addAt = function(position, item) {
	if(position.constructor !== Number) {
		throw new TypeError("position should be a Number");
	}
	if(this.contains(item)) {
		throw new Error("Item is already in collection");
	}
	
	this.splice(position, 0, item);
};

/**
 * Add a Item before a given other item in the stack
 * @param {Object} before
 * @param {Object} item
 */
ObjectCollection.prototype.addBefore = function(before, item) {
	before = this.indexOf(before);
	if(before === -1) {
		throw new Error("Item to add before not found");
	}
	this.addAt(before, item);
};

/**
 * Add a Item after a given other item in the stack
 * @param {Object} after
 * @param {Object} item
 */
ObjectCollection.prototype.addAfter = function(after, item) {
	after = this.indexOf(after);
	if(after === -1) {
		throw new Error("Item to add after not found");
	}
	this.addAt(after+1, item);
};

/**
 * Removes a item from the stack
 * @param {Object} item
 */
ObjectCollection.prototype.remove = function(item) {
	var i = this.indexOf(item);
	if(i === -1) {
		throw new Error("Item not found");
	}
	this.splice(i, 1);
};

/**
 * Tells if the collection contains the item
 * @param {Object} item
 * @return bool
 */
ObjectCollection.prototype.contains = function(item) {
	return this.indexOf(item) !== -1;
};
