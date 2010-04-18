/**
 * Sprite Frame Behavior shows a certain frame
 * 
 * @constructor
 * @param direction
 * @param frame
 * @implements SpriteBehaviorInterface
 */
function SpriteBehaviorFrame(direction, frame) {
	if(direction !== SpriteBehaviorFrame.vertical &&
	direction !== SpriteBehaviorFrame.horizontal) {
		throw new TypeError("Direction should either be vertical or horizontal");
	}
	this.direction = direction;
	this.frame = frame || 0;
}

SpriteBehaviorFrame.vertical = 1;
SpriteBehaviorFrame.horizontal = 2;

SpriteBehaviorFrame.prototype = {
	updateSprite : function(sprite, display, time) {
		if(this.direction === SpriteBehaviorFrame.horizontal) {
			sprite.source_left = (this.frame % sprite.image.horizontalFrames) *
			sprite.image.width; 
		}
		else {
			sprite.source_top = (this.frame % sprite.image.verticalFrames) *
			sprite.image.height; 
		}
	}
};