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

test("Update Sprite", function(){
	var mockSprite = {
		source_left : 0,
		source_top : 0,
		image : {
			horizontalFrames : 8,
			verticalFrames : 6,
			width : 16,
			height : 30
		}
	};
	
	var obj = new SpriteBehaviorAnimate(SpriteBehaviorAnimate.horizontal, 300);
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