/**
 * Sprite Frame Behavior shows a certain frame
 * 
 * @constructor
 * @param direction
 * @param frame
 * @implements SpriteBehaviorInterface
 */
WebZed.SpriteBehaviorFrame = function (direction, frame) {
	if(direction !== WebZed.SpriteBehaviorFrame.vertical &&
	direction !== WebZed.SpriteBehaviorFrame.horizontal) {
		throw new TypeError("Direction should either be vertical or horizontal");
	}
	this.direction = direction;
	this.frame = frame || 0;
};

WebZed.SpriteBehaviorFrame.vertical = 1;
WebZed.SpriteBehaviorFrame.horizontal = 2;

WebZed.SpriteBehaviorFrame.prototype = {
	updateSprite : function(sprite, display, time) {
		if(this.direction === WebZed.SpriteBehaviorFrame.horizontal) {
			sprite.source_left = (this.frame % sprite.image.horizontalFrames) *
			sprite.image.width; 
		}
		else {
			sprite.source_top = (this.frame % sprite.image.verticalFrames) *
			sprite.image.height; 
		}
	}
};
