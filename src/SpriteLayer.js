/**
 * SpriteLayer class
 * @param display
 * @param fps
 * @constructor
 */
function SpriteLayer(display, fps) {
	Interface.ensureImplements(display, DisplayInterface);
	if(fps.constructor !== Number) {
		throw new TypeError("Fps should be of type Number");
	}
	
	this._display = display;
	this._fps = fps;
	
	this._sprites = [];
};


SpriteLayer.prototype.prependSprite = function(sprite) {
	this._addSprite(sprite, 0);
};

SpriteLayer.prototype.appendSprite = function(sprite) {
	this._addSprite(sprite, this._sprites.length);
};

SpriteLayer.prototype.addSpriteBefore = function() {
	
};

/**
 * add a Sprite and its children
 * @param sprite
 */
SpriteLayer.prototype._addSprite = function(sprite, position) {
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
SpriteLayer.prototype.removeSprite = function(sprite) {
	var i = this._sprites.indexOf(sprite);
	if(i === -1) {
		throw new Error("Sprite not found");
	}
	this._sprites.splice(i, 1);
};
