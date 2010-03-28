/**
 * 
 * @constructor
 * @implements PaintableInterface
 */
function Sprite(image, left, top, children, onpaint) {
	if(!image || !(image instanceof ImageSource)) {
		throw new TypeError("image should be a ImageSource object");
	}
	
	this.image = image;
	this.left = left;
	this.top = top;
	this._children = children || new SpriteCollection();
	this._onpaint = onpaint;
	
	this._leftFrame = 0;
	this._topFrame = 0;
};

Sprite.prototype = {
	/**
	 * Paint the Sprite on a display
	 * @param display
	 * @param time Amount of time in milliseconds that have passed
	 * @param left Offset from the left on the display
	 * @param top Offset from the top on the display
	 */
	paint : function(display, time, left, top) {
		if(this.image.speed) {
			if(this.image.direction === ImageSource.horizontal) {
				this._leftFrame = (Math.round(time / this.image.speed) %
					this.image.horizontalFrames) * this.image.width; 
			}
			else {
				this._topFrame = (Math.round(time / this.image.speed) %
					this.image.verticalFrames) * this.image.height; 
			}
		}
		
		if(this._onpaint) {
			this._onpaint(display, time, left, top);
		}
		
		left = this.left + (left || 0);
		top = this.top + (top || 0);
	
		display.paintImage(this.image.node, left, top,
				this.image.width, this.image.height,
				this._leftFrame, this._topFrame);
		
		this._children.paint(display, time, left, top);
	},
	/**
	 * Sets the frame to use
	 * @param frame int frame (starting from zero)
	 */
	setFrame : function(frame) {
		if(this.image.direction === ImageSource.horizontal) {
			this._topFrame = (frame % this.image.verticalFrames) *
				this.image.height; 
		}
		else {
			this._leftFrame = (frame % this.image.horizontalFrames) *
				this.image.width; 
		}
	},
	/**
	 * Checks if the sprite is within the viewport of a Display
	 * @param display the display to check against
	 * @return bool
	 */
	inViewport : function(display) {
		return this.top < display.height &&
			this.left < display.width	&&
			this.top + this.image.height >= 0 &&
			this.left + this.image.width >= 0;
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