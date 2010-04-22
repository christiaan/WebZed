module("Sprite Behavior Frame");
test("Construct", 3, function(){
	var thrown = false, obj;
	try {
		obj = new WebZed.SpriteBehaviorFrame("diagonal");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Direction should be SpriteBehaviorFrame.vertical or SpriteBehaviorFrame.horizontal");
	
	obj = new WebZed.SpriteBehaviorFrame(WebZed.SpriteBehaviorFrame.horizontal, 3);
	equals(obj.direction, WebZed.SpriteBehaviorFrame.horizontal, "Direction set");
	equals(obj.frame, 3, "Frame set");
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
	},
	obj = new WebZed.SpriteBehaviorFrame(WebZed.SpriteBehaviorFrame.horizontal, 3);
	
	obj.updateSprite(mockSprite, {}, 300);
	
	equals(mockSprite.source_top, 0, "Top offset unchanged");
	equals(mockSprite.source_left, 48, "Left offset set to 3th frame");
	
	obj.frame = 8;
	obj.updateSprite(mockSprite, {}, 1622381);
	
	equals(mockSprite.source_top, 0, "Top offset unchanged");
	equals(mockSprite.source_left, 0, "Left offset wrapped around to 1th frame");
	
	obj.frame = 9;
	obj.updateSprite(mockSprite, {}, 0);
	
	equals(mockSprite.source_top, 0, "Top offset unchanged");
	equals(mockSprite.source_left, 16, "Left offset wrapped around to 2nd frame");
	
	mockSprite.source_left = 0;
	mockSprite.source_top = 0;
	obj = new WebZed.SpriteBehaviorFrame(WebZed.SpriteBehaviorFrame.vertical, 3);
	
	obj.updateSprite(mockSprite, {}, -89234);
	equals(mockSprite.source_left, 0, "Left offset unchanged");
	equals(mockSprite.source_top, 90, "Top offset wrapped around to 4th frame");
	
	obj.frame = 0;
	obj.updateSprite(mockSprite, {}, 934508089);
	equals(mockSprite.source_left, 0, "Left offset unchanged");
	equals(mockSprite.source_top, 0, "Top offset set to 1th frame");
});