module("Sprite Behavior Animate");
test("Construct", 4, function(){
	var thrown = false;
	try {
		new SpriteBehaviorAnimate("diagonal");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Direction should be SpriteBehaviorAnimate.vertical or SpriteBehaviorAnimate.horizontal");
	
	thrown = false;
	try {
		new SpriteBehaviorAnimate(SpriteBehaviorAnimate.horizontal, "fast");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Speed should be a number");
	
	var obj = new SpriteBehaviorAnimate(SpriteBehaviorAnimate.horizontal, 300);
	equals(obj.direction, SpriteBehaviorAnimate.horizontal, "Direction set");
	equals(obj.speed, 300, "Speed set");
});

test("Update Sprite", 14, function(){
	var mockSprite = {
		source_left : 0,
		source_top : 0,
		image : {
			horizontalFrames : 8,
			verticalFrames : 6,
			width : 16,
			height : 30
		},
		behaviors : {
			remove : function() {this.args = arguments;}
		}
	};
	
	var obj = new SpriteBehaviorAnimate(SpriteBehaviorAnimate.horizontal, 300);
	
	// First time our behavior sees is 0 so the animation started at 0
	obj.updateSprite(mockSprite, {}, 0);
	
	obj.updateSprite(mockSprite, {}, 299);
	
	equals(mockSprite.source_top, 0, "Top offset unchanged");
	equals(mockSprite.source_left, 0, "Left offset set to 1th frame");
	
	obj.updateSprite(mockSprite, {}, 300);
	equals(mockSprite.source_top, 0, "Top offset unchanged");
	equals(mockSprite.source_left, 16, "Left offset set to 2nd frame");
	
	obj.updateSprite(mockSprite, {}, 2690);
	equals(mockSprite.source_top, 0, "Top offset unchanged");
	equals(mockSprite.source_left, 0, "Left offset wrapped around set to 1th frame");
	
	obj.updateSprite(mockSprite, {}, 2780);
	equals(mockSprite.source_top, 0, "Top offset unchanged");
	equals(mockSprite.source_left, 16, "Left offset wrapped around set to 2nd frame");
	
	mockSprite.source_left = 0;
	mockSprite.source_top = 0;
	
	obj = new SpriteBehaviorAnimate(SpriteBehaviorAnimate.vertical, 10);
	// First time our behavior sees is 0 so the animation started at 0
	obj.updateSprite(mockSprite, {}, 0);
	
	obj.updateSprite(mockSprite, {}, 5);
	
	equals(mockSprite.source_left, 0, "Left offset unchanged");
	equals(mockSprite.source_top, 0, "Top offset set to 1th frame");
	
	obj.updateSprite(mockSprite, {}, 53);
	equals(mockSprite.source_left, 0, "Left offset unchanged");
	equals(mockSprite.source_top, 150, "Top offset set to 5th frame");
	
	obj.updateSprite(mockSprite, {}, 75);
	equals(mockSprite.source_left, 0, "Left offset unchanged");
	equals(mockSprite.source_top, 30, "Top offset wrapped around and set to 2nd frame");
	
});

test("Update Sprite Once", 11, function(){
	var mockSprite = {
		source_left : 0,
		source_top : 0,
		image : {
			horizontalFrames : 8,
			verticalFrames : 6,
			width : 16,
			height : 30
		},
		behaviors : {
			remove : function() {this.args = arguments;}
		}
	},
	mockDisplay = {};
	
	var once = function() {
		once.args = arguments;
		once.context = this;
	};
	var obj = new SpriteBehaviorAnimate(SpriteBehaviorAnimate.vertical, 10, once);
	obj.updateSprite(mockSprite, mockDisplay, 0);
	ok(!once.args, "Once isn't called on first call");
	obj.updateSprite(mockSprite, mockDisplay, 10);
	ok(!once.args, "Once isn't called on second frame either");
	obj.updateSprite(mockSprite, mockDisplay, 50);
	ok(!once.args, "Once isn't called on last frame either");
	
	obj.updateSprite(mockSprite, mockDisplay, 60);
	ok(once.args, "Once is called as we wrapped around back to the first frame");
	equals(once.args.length, 3, "Sprite display and time given");
	same(once.args[0], mockSprite, "First arg is the sprite");
	same(once.args[1], mockDisplay, "Second is the display");
	equals(once.args[2], 60, "3th param is the time");
	same(once.context, obj, "Context is the behavior");
	
	ok(mockSprite.behaviors.args, "Sprite.behaviors.remove is called");
	same(mockSprite.behaviors.args[0], obj, "Behavior is given as arg to remove");
});
