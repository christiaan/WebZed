/**
 * Animated Sprite Behavior
 *
 * @constructor
 * @param direction direction of the animation
 * @param speed amount of time between frames
 * @implements SpriteBehaviorInterface
 */
function SpriteBehaviorAnimate(direction, speed) {
	if(direction !== SpriteBehaviorAnimate.vertical &&
	direction !== SpriteBehaviorAnimate.horizontal) {
		throw new TypeError("Direction should either be vertical or horizontal");
	}
	if(speed.constructor !== Number) {
		throw new TypeError("Speed should be a number");
	}
	
	this.direction = direction;
	this.speed = speed;
};

SpriteBehaviorAnimate.vertical = 1;
SpriteBehaviorAnimate.horizontal = 2;

SpriteBehaviorAnimate.prototype = {
	updateSprite : function(sprite, display, time) {
		if(this.direction === SpriteBehaviorAnimate.horizontal) {
			sprite.source_left = sprite.image.width * 
				(Math.floor(time / this.speed) % sprite.image.horizontalFrames); 
		}
		else {
			sprite.source_top = sprite.image.height *
				(Math.floor(time / this.speed) % sprite.image.verticalFrames); 
		}
	}	
};