/**
 * A array in which all entries should be unique and some extra methods
 * 
 * @constructor
 * @implements PaintableInterface
 * @param {Array} paintables
 */
WebZed.PaintableCollection = function (paintables) {
	if (paintables) {
		if (!(paintables instanceof Array)) {
			throw new TypeError("paintables should be an array");
		}
		paintables.forEach(function (item) {
			this.push(item);
		}, this);
	}
};

// extend ObjectCollection
WebZed.PaintableCollection.prototype = new WebZed.ObjectCollection();

/**
 * Overwrite the default push and check if new item implements PaintableInterface
 */
WebZed.PaintableCollection.prototype.push = function (item) {
	WebZed.Interface.ensureImplements(item, WebZed.PaintableInterface);
	return WebZed.ObjectCollection.prototype.push.call(this, item);
};

/**
 * Overwrite the default unshift to check if an item implements PaintableInterface
 */
WebZed.PaintableCollection.prototype.unshift = function (item) {
	WebZed.Interface.ensureImplements(item, WebZed.PaintableInterface);
	return WebZed.ObjectCollection.prototype.unshift.call(this, item);
};

/**
 * Overwrite the addAt method to check if the item implements PaintableInterface
 */
WebZed.PaintableCollection.prototype.addAt = function (position, item) {
	WebZed.Interface.ensureImplements(item, WebZed.PaintableInterface);
	return WebZed.ObjectCollection.prototype.addAt.call(this, position, item);
};

/**
 * Runs the paint method on all paintables with the given arguments
 */
WebZed.PaintableCollection.prototype.paint = function () {
	for (var i = 0, len = this.length; i < len; i += 1) {
		this[i].paint.apply(this[i], arguments);
	}
};
