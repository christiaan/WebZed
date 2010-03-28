/**
 * 
 * @constructor
 * @implements PaintableInterface
 * @param {ImageSource} image
 * @param {Number} left
 * @param {Number} top
 * @param {Function} onpaint
 * @param {PaintableCollection} children
 */
function Sprite(image, left, top, onpaint, children) {
	if(!image || !(image instanceof ImageSource)) {
		throw new TypeError("image should be a ImageSource object");
	}
	if(left.constructor !== Number) {
		throw new TypeError("left should be a Number");
	}
	if(top.constructor !== Number) {
		throw new TypeError("top should be a Number");
	}
	if(onpaint && !(onpaint instanceof Function)) {
		throw new TypeError("onpaint should be a Function");
	}
	if(children && !(children instanceof PaintableCollection)) {
		throw new TypeError("children should be a PaintableCollection");
	}
	
	this.image = image;
	this.left = left;
	this.top = top;
	this.onpaint = onpaint;
	this.children = children || new PaintableCollection();
	
	this.frame = 0;
};

Sprite.prototype = {
	/**
	 * Paint the ImageSource on a display
	 * @param display
	 * @param time Amount of time in milliseconds that have passed
	 * @param left Offset from the left on the display
	 * @param top Offset from the top on the display
	 */
	paint : function(display, time, left, top) {
		var source_left = 0, source_top = 0;
	
		if(this.image.speed !== 0) {
			if(this.image.direction === ImageSource.horizontal) {
				source_left = (Math.round(time / this.image.speed) %
					this.image.horizontalFrames) * this.image.width; 
			}
			else {
				source_top = (Math.round(time / this.image.speed) %
					this.image.verticalFrames) * this.image.height; 
			}
		}
		
		if(this.frame !== 0) {
			if(this.image.direction === ImageSource.horizontal) {
				source_top = (this.frame % this.image.verticalFrames) *
					this.image.height; 
			}
			else {
				source_left = (this.frame % this.image.horizontalFrames) *
					this.image.width; 
			}
		}
		
		if(this.onpaint) {
			if(false === this.onpaint(display, time, left, top)) {
				return;
			}
		}
		
		left = this.left + (left || 0);
		top = this.top + (top || 0);
	
		display.paintImage(this.image.node, left, top,
				this.image.width, this.image.height,
				source_left, source_top);
		
		this.children.paint(display, time, left, top);
	},
	/**
	 * Checks if the sprite is within the viewport of a Display
	 * @param display the display to check against
	 * @return bool
	 */
	inViewport : function(display) {
		return this.top < display.height &&
			this.left < display.width &&
			this.top + this.image.height > 0 &&
			this.left + this.image.width > 0;
	},
	/**
	 * Checks if we collide with other sprites
	 * WARNING this does not take parent offsets into account like painting does
	 * so only use this with sprites which are in the same PaintableCollection
	 * 
	 * @param sprites array with sprites to test against
	 * @return array with sprites that collided
	 */
	collidesWith : function(sprites) {
		var result = [], i, sprite,
		bottom = this.top + this.image.height,
		right = this.left + this.image.width;
			
		for(i = sprites.length - 1; i >= 0; --i) {
			sprite = sprites[i];
			if(sprite === this) {
				continue;
			}
			
			// we're to far to the top to touch
			if(sprite.top + sprite.image.height < this.top ||
			// we're to far to the right to touch
			sprite.left + sprite.image.width < this.left ||
			// we're to far to the bottom to touch
			sprite.top > bottom ||
			// we're to far to the left to touch
			sprite.left > right) {
				continue;
			}
			result.push(sprite);
		}
				
		return result;
	}
};