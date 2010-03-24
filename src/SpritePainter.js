/**
 * SpritePainter class
 * @param display The display at which the sprites should paint
 * @param milliseconds amount of milliseconds between frame paints
 * @constructor
 */
function SpritePainter(display, milliseconds) {
	Interface.ensureImplements(display, DisplayInterface);
	if(milliseconds.constructor !== Number) {
		throw new TypeError("milliseconds should be of type Number");
	}
	
	this._display = display;
	this._milliseconds = milliseconds;
	
	this._sprites = [];
	this._interval = null;
	this._tick = null;
};

/**
 * Prepend a Sprite to the front of the stack
 * @param sprite
 */
SpritePainter.prototype.prependSprite = function(sprite) {
	this.addSpriteAt(sprite, 0);
};

/**
 * Append a Sprite at the end of the stack
 * @param sprite
 */
SpritePainter.prototype.appendSprite = function(sprite) {
	this.addSpriteAt(sprite, this._sprites.length);
};

/**
 * Add a Sprite before a given other sprite in the stack
 * @param sprite
 * @param before
 */
SpritePainter.prototype.addSpriteBefore = function(sprite, before) {
	before = this._sprites.indexOf(before);
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
SpritePainter.prototype.addSpriteAfter = function(sprite, after) {
	after = this._sprites.indexOf(after);
	if(after === -1) {
		throw new Error("Sprite to add after not found");
	}
	this.addSpriteAt(sprite, after+1);
};

/**
 * Add a Sprite to the stack at the given position
 * @param sprite
 * @param position
 */
SpritePainter.prototype.addSpriteAt = function(sprite, position) {
	var i = this._sprites.indexOf(sprite);
	if(i !== -1) {
		this._sprites.splice(i, 1);
	}
	
	this._sprites.splice(position, 0, sprite);
};
	
/**
 * Removes a sprite and its children from the layer
 * @param sprite
 */
SpritePainter.prototype.removeSprite = function(sprite) {
	var i = this._sprites.indexOf(sprite);
	if(i === -1) {
		throw new Error("Sprite not found");
	}
	this._sprites.splice(i, 1);
};

/**
 * Starts the painting loop at the configured interval
 */
SpritePainter.prototype.start = function() {
	if(this._interval) {
		throw new Error("Paint loop has already started");
	}
	var self = this;
	this._tick = 0;
	this._interval = setInterval(function(offset){
		self.paint(offset);
	}, this._milliseconds);
	this.paint(0);
};

/**
 * Stops the painting loop
 */
SpritePainter.prototype.stop = function() {
	if(!this._interval) {
		throw new Error("Paint loop hasn't started");
	}
	clearInterval(this._interval);
	this._tick = null;
};

/**
 * 
 * @param offset Milliseconds offset
 * @return
 */
SpritePainter.prototype.paint = function(offset) {
	var millisecs = offset + (this._milliseconds * this._tick);
	
	for(var i = 0, len = this._sprites.length; i < len; i++) {
		this._sprites.paint(this._display, millisecs);
	}
	
	++this._tick;
};
