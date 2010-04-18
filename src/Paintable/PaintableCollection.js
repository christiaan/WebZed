/**
 * A array in which all entries should be unique and some extra methods
 * 
 * @constructor
 * @implements PaintableInterface
 * @param {Array} paintables
 */
function PaintableCollection(paintables) {
	if (paintables) {
		if (!(paintables instanceof Array)) {
			throw new TypeError("paintables should be an array");
		}
		paintables.forEach(function (item) {
			this.push(item);
		}, this);
	}
}

// extend ObjectCollection
PaintableCollection.prototype = new ObjectCollection();

/**
 * Overwrite the default push and check if new item implements PaintableInterface
 */
PaintableCollection.prototype.push = function (item) {
	Interface.ensureImplements(item, PaintableInterface);
	return ObjectCollection.prototype.push.call(this, item);
};

/**
 * Overwrite the default unshift to check if an item implements PaintableInterface
 */
PaintableCollection.prototype.unshift = function (item) {
	Interface.ensureImplements(item, PaintableInterface);
	return ObjectCollection.prototype.unshift.call(this, item);
};

/**
 * Overwrite the addAt method to check if the item implements PaintableInterface
 */
PaintableCollection.prototype.addAt = function (position, item) {
	Interface.ensureImplements(item, PaintableInterface);
	return ObjectCollection.prototype.addAt.call(this, position, item);
};

/**
 * Runs the paint method on all paintables with the given arguments
 */
PaintableCollection.prototype.paint = function () {
	for (var i = 0, len = this.length; i < len; i += 1) {
		this[i].paint.apply(this[i], arguments);
	}
};
