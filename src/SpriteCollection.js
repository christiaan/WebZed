/**
 * A array in which all entries should be unique and some extra methods
 * 
 * @constructor
 * @param sprites Array
 */
function SpriteCollection(sprites) {
	if(sprites) {
		if(!(sprites instanceof Array)) {
			throw new TypeError("sprites should be an array");
		}
		sprites.forEach(function(sprite) {
			this.push(sprite);
		}, this);
	}
};

// extend array
SpriteCollection.prototype = new Array();

/**
 * Add a Sprite before a given other sprite in the stack
 * @param sprite
 * @param before
 */
SpriteCollection.prototype.addBefore = function(sprite, before) {
	before = this.indexOf(before);
	if(before === -1) {
		throw new Error("Sprite to add before not found");
	}
	this.addSpriteAt(sprite, before);
};

/**
 * Add a Sprite after a given other sprite in the stack
 * @param sprite
 * @param after
 */
SpriteCollection.prototype.addAfter = function(sprite, after) {
	after = this.indexOf(after);
	if(after === -1) {
		throw new Error("Sprite to add after not found");
	}
	this.addSpriteAt(sprite, after+1);
};

/**
 * Pushes a sprite on the end of the collection
 * @param sprite
 * @return int New length of the collection
 */
SpriteCollection.prototype.push = function(sprite) {
	var i = this.indexOf(sprite);
	if(i !== -1) {
		throw new Error("Sprite is already in collection");
	}
	return Array.prototype.push.call(this, sprite);
};

/**
 * Unshifts a sprite to the start of the collection
 * @param sprite
 * @return int New length of the collection
 */
SpriteCollection.prototype.unshift = function(sprite) {
	var i = this.indexOf(sprite);
	if(i !== -1) {
		throw new Error("Sprite is already in collection");
	}
	return Array.prototype.unshift.call(this, sprite);
};

/**
 * Add a Sprite to the stack at the given position
 * @param sprite
 * @param position
 */
SpriteCollection.prototype.addAt = function(sprite, position) {
	var i = this.indexOf(sprite);
	if(i !== -1) {
		throw new Error("Sprite is already in collection");
	}
	
	this.splice(position, 0, sprite);
};
	
/**
 * Removes a sprite
 * @param sprite
 */
SpriteCollection.prototype.remove = function(sprite) {
	var i = this.indexOf(sprite);
	if(i === -1) {
		return false;
	}
	this.splice(i, 1);
	return true;
};

/**
 * Tells if the collection contains the sprite
 * @param sprite
 * @return bool
 */
SpriteCollection.prototype.contains = function(sprite) {
	return this.indexOf(sprite) !== -1;
};

/**
 * Runs the paint method on all sprites with the given arguments
 */
SpriteCollection.prototype.paint = function() {
	for(var i = 0, len = this.length; i < len; i++) {
		// TODO replace with a plain paint call when arguments are settled
		this[i].paint.apply(this[i], arguments);
	}
};
