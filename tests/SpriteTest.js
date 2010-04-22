module("Sprite", {setup : function() {
	this.mockImg = {
		nodeName : "IMG",
		complete : true,
		width : 320,
		height : 384,
		src : "../media/img/planets/arctic.png"
	}; 
	this.imgSrc = new WebZed.ImageSource(this.mockImg, 16, 32);
	var onpaint = function () {
		onpaint.context = this;
		onpaint.args = arguments;
		return onpaint.retval;
	};
	onpaint.retval = true;
	
	this.onpaint = onpaint;
	
	this.mockDisplay = {
		"paintImage" : function(){ this.args = arguments; },
		width: 640,
		height: 480
	};
}});

test("Constructor", 14, function(){
	var thrown = false, obj;
	try {
		obj = new WebZed.Sprite();
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown when no ImageSource is given");
	
	thrown = false;
	try {
		obj = new WebZed.Sprite({});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown when the given imagesource is no ImageSource");
	
	thrown = false;
	try {
		obj = new WebZed.Sprite(this.imgSrc, "16");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if the left offset is no Number");
	
	thrown = false;
	try {
		obj = new WebZed.Sprite(this.imgSrc, 16, "32");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if the top offset is no Number");

	thrown = false;
	try {
		obj = new WebZed.Sprite(this.imgSrc, 16, 32, "behaviors");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if behaviors is no array and set");
	
	thrown = false;
	try {
		obj = new WebZed.Sprite(this.imgSrc, 16, 32, new WebZed.ObjectCollection(), "onpaint");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if onpaint is no Function");
	
	thrown = false;
	try {
		obj = new WebZed.Sprite(this.imgSrc, 16, 32, new WebZed.ObjectCollection(), this.onpaint, {});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "TypeError thrown if children is no PaintableCOllection");
	
	thrown = false;
	try {
		obj = new WebZed.Sprite(this.imgSrc, 16, 32, new WebZed.ObjectCollection(), this.onpaint, new WebZed.PaintableCollection());
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "Succesfully create a sprite");
	
	obj = new WebZed.Sprite(this.imgSrc, 16, 32, new WebZed.ObjectCollection(), this.onpaint);
	
	same(obj.image, this.imgSrc, "Img is set as source");
	equals(obj.left, 16, "Left offset is sucessfully set");
	equals(obj.top, 32, "Top offset is succesfully set");
	same(obj.onpaint, this.onpaint, "Onpaint succesfully set");
	ok(obj.children instanceof WebZed.PaintableCollection, "Children is a PaintableCollection");
	equals(obj.children.length, 0, "Children is empty by default");
});

test("Paint", 22, function(){
	var obj, mockChild;
	
	obj = new WebZed.Sprite(this.imgSrc, 200, 300, undefined, this.onpaint);
	
	obj.paint(this.mockDisplay, 0);
	same(this.mockDisplay.args[0], this.mockImg, "First arg should be the image node");
	equals(this.mockDisplay.args[1], 200, "Second the left offset");
	equals(this.mockDisplay.args[2], 300, "Thirth the top offset");
	equals(this.mockDisplay.args[3], 16, "4th the width of the img source");
	equals(this.mockDisplay.args[4], 32, "5th the heigth of the img source");
	equals(this.mockDisplay.args[5], 0, "6th the left offset on the img source");
	equals(this.mockDisplay.args[6], 0, "7th the top offset on the img source");
	
	same(this.onpaint.context, obj, "onpaint should be called in the context of Sprite");
	same(this.onpaint.args[0], this.mockDisplay, "first arg should be the display");
	equals(this.onpaint.args[1], 0, "second arg the time");
	equals(this.onpaint.args[2], undefined, "3th the left offset");
	equals(this.onpaint.args[3], undefined, "4th the top offset");
	
	obj.source_top = 32;
	obj.paint(this.mockDisplay, 0);
	equals(this.mockDisplay.args[6], 32, "Source Top gets passed");
	
	obj.source_left = 64;
	obj.paint(this.mockDisplay, 2000);
	equals(this.mockDisplay.args[5], 64, "Source Left gets passed");
	
	
	// Check if the child sprites get correctly called
	mockChild = {"paint" : function(){this.args = arguments;}};
	obj.children.push(mockChild);
	obj.paint(this.mockDisplay, 4000);
	same(mockChild.args[0], this.mockDisplay, "Same display as parent");
	equals(mockChild.args[1], 4000, "Same time as parent");
	equals(mockChild.args[2], 200, "Parent's left position as offset");
	equals(mockChild.args[3], 300, "Parent's top position as offset");
	equals(mockChild.args.length, 4, "4 arguments passed");
	
	// Check that onpaint correctly aborts painting on display and children
	this.onpaint.retval = false;
	this.onpaint.args = undefined;
	this.mockDisplay.args = undefined;
	mockChild.args = undefined;
	obj.paint(this.mockDisplay, 1000);
	ok(this.onpaint.args !== undefined, "onpaint called and returned false");
	ok(this.mockDisplay.args === undefined, "Display is not called");
	ok(mockChild.args === undefined, "Child is not called");
});

test("InViewport", 9, function() {
	var obj = new WebZed.Sprite(this.imgSrc, 200, 300);
	
	ok(obj.inViewport(this.mockDisplay), "somewhere in the middle");
	obj.left = -16;
	ok(!obj.inViewport(this.mockDisplay), "just outside at the left");
	obj.left = -15;
	ok(obj.inViewport(this.mockDisplay), "just one pixel in at the left");
	obj.left = 0;
	obj.top = -32;
	ok(!obj.inViewport(this.mockDisplay), "just outside at the top");
	obj.top = -31;
	ok(obj.inViewport(this.mockDisplay), "just one pixel in at the top");
	obj.left = 640;
	obj.top = 0;
	ok(!obj.inViewport(this.mockDisplay), "just outside at the right");
	obj.left = 639;
	ok(obj.inViewport(this.mockDisplay), "just one pixel in at the right");
	obj.left = 0;
	obj.top = 480;
	ok(!obj.inViewport(this.mockDisplay), "just outside at the bottom");
	obj.top = 479;
	ok(obj.inViewport(this.mockDisplay), "just one pixel in at the bottom");
});

test("CollidesWith", function() {
	var obj, obj2;
	obj = new WebZed.Sprite(this.imgSrc, 10, 10);
	obj2 = new WebZed.Sprite(this.imgSrc, 200, 300);
	
	ok(obj.collidesWith([obj2]).length === 0, "No collision");
	obj.left = 208;
	obj.top = 298;
	ok(obj.collidesWith([obj2]).length === 1, "collision");
	
	// TODO test some more edge cases
});
