/**
 * Animated Sprite Behavior
 *
 * @constructor
 * @param {Number} direction direction of the animation
 * @param {Number} speed amount of time between frames
 * @param {Function} once If this is set the animation is just run once 
 * @implements SpriteBehaviorInterface
 */
WebZed.SpriteBehaviorAnimate = function (direction, speed, once) {
	if(direction !== WebZed.SpriteBehaviorAnimate.vertical &&
	direction !== WebZed.SpriteBehaviorAnimate.horizontal) {
		throw new TypeError("Direction should either be vertical or horizontal");
	}
	if(speed.constructor !== Number) {
		throw new TypeError("Speed should be a number");
	}
	if(once && true !== once && !(once instanceof Function)) {
		throw new TypeError("Once should be a callback function or boolean true");
	}
	
	this.direction = direction;
	this.speed = speed;
	this.once = once || false;
	this.start_time = false;
};

WebZed.SpriteBehaviorAnimate.vertical = 1;
WebZed.SpriteBehaviorAnimate.horizontal = 2;

WebZed.SpriteBehaviorAnimate.prototype = {
	/**
	 * Method that will run before a sprite paints itself on a display
	 * 
	 * @param {Sprite} sprite the sprite that is about to write
	 * @param {DisplayInterface} display the display the spite has to write to
	 * @param {Number} time amount of milliseconds
	 */
	updateSprite : function(sprite, display, time) {
		// The animation should start from the first call
		if(false === this.start_time) {
			this.start_time = time;
		}
		time = time - this.start_time;
		
		if(false !== this.once) {
			var frames;
			if(this.direction === WebZed.SpriteBehaviorAnimate.horizontal) {
				frames = sprite.image.horizontalFrames;
			}
			else {
				frames = sprite.image.verticalFrames;
			}
			
			if(time >= this.speed * frames) {
				if(true !== this.once) {
					this.once(sprite, display, time);
				}
				sprite.behaviors.remove(this);
			}
		}
	
		if(this.direction === WebZed.SpriteBehaviorAnimate.horizontal) {
			sprite.source_left = sprite.image.width * 
				(Math.floor(time / this.speed) % sprite.image.horizontalFrames); 
		}
		else {
			sprite.source_top = sprite.image.height *
				(Math.floor(time / this.speed) % sprite.image.verticalFrames); 
		}
	}	
};
