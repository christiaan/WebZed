(function() {
var mockImg = {
	nodeName : "IMG",
	complete : true,
	width : 320,
	height : 384,
	src : "../media/img/planets/arctic.png"
};
var imgSrc = new ImageSource(mockImg, 16, 32);
var onpaint = function(){ onpaint.context = this; onpaint.args = arguments; return onpaint.retval; };
onpaint.retval = true;
	
module("Sprite");
test("Constructor", 14, function(){
	var thrown = false;
	try {
		new Sprite();
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown when no ImageSource is given");
	
	thrown = false;
	try {
		new Sprite({});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown when the given imagesource is no ImageSource");
	
	thrown = false;
	try {
		new Sprite(imgSrc, "16");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if the left offset is no Number");
	
	thrown = false;
	try {
		new Sprite(imgSrc, 16, "32");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if the top offset is no Number");

	thrown = false;
	try {
		new Sprite(imgSrc, 16, 32, "behaviors");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if behaviors is no array and set");
	
	thrown = false;
	try {
		new Sprite(imgSrc, 16, 32, [], "onpaint");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if onpaint is no Function");
	
	thrown = false;
	try {
		new Sprite(imgSrc, 16, 32, [], onpaint, {});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if children is no PaintableCOllection");
	
	thrown = false;
	try {
		new Sprite(imgSrc, 16, 32, [], onpaint, new PaintableCollection());
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "Succesfully create a sprite");
	
	var tmp = new Sprite(imgSrc, 16, 32, [], onpaint);
	
	same(tmp.image, imgSrc, "Img is set as source");
	equals(tmp.left, 16, "Left offset is sucessfully set");
	equals(tmp.top, 32, "Top offset is succesfully set");
	same(tmp.onpaint, onpaint, "Onpaint succesfully set");
	ok(tmp.children instanceof PaintableCollection, "Children is a PaintableCollection");
	equals(tmp.children.length, 0, "Children is empty by default");
});

test("Paint", 26, function(){
	var mockDisplay = {"paintImage" : function(){ this.args = arguments; }};
	var obj = new Sprite(imgSrc, 200, 300, undefined, onpaint);
	
	obj.paint(mockDisplay, 0);
	same(mockDisplay.args[0], mockImg, "First arg should be the image node");
	equals(mockDisplay.args[1], 200, "Second the left offset");
	equals(mockDisplay.args[2], 300, "Thirth the top offset");
	equals(mockDisplay.args[3], 16, "4th the width of the img source");
	equals(mockDisplay.args[4], 32, "5th the heigth of the img source");
	equals(mockDisplay.args[5], 0, "6th the left offset on the img source");
	equals(mockDisplay.args[6], 0, "7th the top offset on the img source");
	
	same(onpaint.context, obj, "onpaint should be called in the context of Sprite");
	same(onpaint.args[0], mockDisplay, "first arg should be the display");
	equals(onpaint.args[1], 0, "second arg the time");
	equals(onpaint.args[2], undefined, "3th the left offset");
	equals(onpaint.args[3], undefined, "4th the top offset");
	
	var animBehavior = new SpriteBehaviorAnimate(SpriteBehaviorAnimate.vertical, 1000);
	obj.behaviors.push(animBehavior);
	obj.paint(mockDisplay, 1000);
	equals(mockDisplay.args[6], 32, "default animation axis is vertical the source top offset should be to the next frame");
	
	var frameBehavior = new SpriteBehaviorFrame(SpriteBehaviorFrame.horizontal);
	obj.behaviors.push(frameBehavior);
	frameBehavior.frame = 1;
	
	obj.paint(mockDisplay, 2000);
	equals(mockDisplay.args[5], 16, "At the 2nd frame");
	equals(mockDisplay.args[6], 64, "And at the 3th frame of the animation");
	
	
	animBehavior.direction = SpriteBehaviorAnimate.horizontal;
	frameBehavior.direction = SpriteBehaviorFrame.vertical;
	
	obj.paint(mockDisplay, 1000);
	equals(mockDisplay.args[5], 16, "axis set to horizontal the source left offset should be to the next frame");
	obj.paint(mockDisplay, 2000);
	equals(mockDisplay.args[6], 32, "At the 2nd frame");
	equals(mockDisplay.args[5], 32, "And at the 3th frame of the animation");
	obj.image.direction = ImageSource.vertical;
	
	// Check if the child sprites get correctly called
	var mockChild = {"paint" : function(){this.args = arguments;}};
	obj.children.push(mockChild);
	obj.paint(mockDisplay, 4000);
	same(mockChild.args[0], mockDisplay, "Same display as parent");
	equals(mockChild.args[1], 4000, "Same time as parent");
	equals(mockChild.args[2], 200, "Parent's left position as offset");
	equals(mockChild.args[3], 300, "Parent's top position as offset");
	equals(mockChild.args.length, 4, "4 arguments passed");
	
	// Check that onpaint correctly aborts painting on display and children
	onpaint.retval = false;
	onpaint.args = undefined;
	mockDisplay.args = undefined;
	mockChild.args = undefined;
	obj.paint(mockDisplay, 1000);
	ok(onpaint.args !== undefined, "onpaint called and returned false");
	ok(mockDisplay.args === undefined, "Display is not called");
	ok(mockChild.args === undefined, "Child is not called");
	onpaint.retval = true;
});

test("InViewport", 9, function() {
	var mockDisplay = {width: 640, height: 480};
	var obj = new Sprite(imgSrc, 200, 300);
	
	ok(obj.inViewport(mockDisplay), "somewhere in the middle");
	obj.left = -16;
	ok(!obj.inViewport(mockDisplay), "just outside at the left");
	obj.left = -15;
	ok(obj.inViewport(mockDisplay), "just one pixel in at the left");
	obj.left = 0;
	obj.top = -32;
	ok(!obj.inViewport(mockDisplay), "just outside at the top");
	obj.top = -31;
	ok(obj.inViewport(mockDisplay), "just one pixel in at the top");
	obj.left = 640;
	obj.top = 0;
	ok(!obj.inViewport(mockDisplay), "just outside at the right");
	obj.left = 639;
	ok(obj.inViewport(mockDisplay), "just one pixel in at the right");
	obj.left = 0;
	obj.top = 480;
	ok(!obj.inViewport(mockDisplay), "just outside at the bottom");
	obj.top = 479;
	ok(obj.inViewport(mockDisplay), "just one pixel in at the bottom");
});

test("CollidesWith", function() {
	var obj = new Sprite(imgSrc, 10, 10);
	var obj2 = new Sprite(imgSrc, 200, 300);
	
	ok(obj.collidesWith([obj2]).length === 0, "No collision");
	obj.left = 208;
	obj.top = 298;
	ok(obj.collidesWith([obj2]).length === 1, "collision");
	
	// TODO test some more edge cases
});

})();