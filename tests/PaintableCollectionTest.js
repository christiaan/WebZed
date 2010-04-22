module("PaintableCollection Constructor should");
test("throw an error if first arg is no array", function(){
	var thrown = false, obj;
	try {
		obj = new WebZed.PaintableCollection({"paint" : function(){}});
	} catch (e) {
		thrown = true;
	}
	ok(thrown);
});

test("work with an empty array", function() {
	var thrown = false, obj;
	try {
		obj = new WebZed.PaintableCollection([]);
	} catch (e) {
		thrown = true;
	}
	ok(!thrown);
});
	
test("work without giving it any params", function() {
	
	var thrown = false, obj;
	try {
		obj = new WebZed.PaintableCollection();
	} catch (e) {
		thrown = true;
	}
	ok(!thrown);
});

test("work when given another Paintable collection", function() {
	var thrown = false, obj;
	try {
		obj = new WebZed.PaintableCollection(obj);
	} catch (e) {
		thrown = true;
	}
	ok(!thrown);
});


module("PaintableCollection should", {
	setup : function() {
		this.mockPaintable = {"paint" : function(){this.args = arguments;}};
		this.anotherMock = {"paint" : function(){this.args = arguments;}};
		this.mockCollection = new WebZed.PaintableCollection();
		this.obj = new WebZed.PaintableCollection();
	}
});

test("throw error when given non PaintableInterface to push", function(){
	var thrown = false;
	try {
		this.obj.push({});
	} catch (e)	{
		thrown = true;
	}
	ok(thrown, "arg should implement PaintableInterface");
});

test("be able to push mockPaintable", function() {
	var thrown = false;
	try {
		this.obj.push(this.mockPaintable);
	} catch (e)	{
		thrown = true;
	}
	equals(this.obj.length, 1, "paintables are accepted");
	same(this.obj[0], this.mockPaintable, "mock is the first entry");
});

test("be able to push mockCollection", function() {
	this.obj.push(this.mockPaintable);
	this.obj.push(this.mockCollection);
	equals(this.obj.length, 2, "Another Collection is accepted as well");
	same(this.obj[1], this.mockCollection, "Collection is added at the end");
	same(this.obj[0], this.mockPaintable, "mock is still the first entry");
});
	
test("throw an error if when given non Paintable to push", function(){
	var thrown = false;
	try {
		this.obj.unshift({});
	} catch (e)	{
		thrown = true;
	}
	ok(thrown);
	
});
	
test("accept a paintable when given to push and place it at the first pos", function() {
	this.obj.unshift(this.mockPaintable);
	equals(this.obj.length, 1, "Paintable is the only item");
	same(this.obj[0], this.mockPaintable, "Paintable is first item");
});

test("succesfully pushes a paintable and another collection", function() {
	
	this.obj.unshift(this.mockPaintable);
	this.obj.unshift(this.mockCollection);
	equals(this.obj.length, 2, "We got 2 items now");
	same(this.obj[1], this.mockPaintable, "Paintable is 2nd item now");
	same(this.obj[0], this.mockCollection, "Collection is the first item");
	
});

test("throw an error when given the same paintable twice", function() {
	this.obj.unshift(this.mockPaintable);
	
	var thrown = false;
	try {
		this.obj.unshift(this.mockPaintable);
	} catch (e) {
		thrown = true;
	}
	ok(thrown);
});

test("throw an exception when AddAt' first param is no Number", function(){
	var thrown = false;
	try {
		this.obj.addAt();
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "position should be a Number");
});

test("throw an exception when AddAt's 2nd param is no paintable", function(){
	var thrown = false;
	try {
		this.obj.addAt(0, {});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "paintable should implement PaintableInterface");
});

test("succesfully add a paintable at position 0 using addAt", function() {
	this.obj.addAt(0, this.mockPaintable);
	same(this.obj[0], this.mockPaintable, "Added at position 0");
});

test("succesfully add another paintable before the first using addAt", function() {
	this.obj.addAt(0, this.mockPaintable);
	this.obj.addAt(0, this.anotherMock);
	same(this.obj[0], this.anotherMock, "Another mock added at position 0");
	same(this.obj[1], this.mockPaintable, "Mock moved 1 position");
});

test("succesfully addAt a paintable collection between two paintables", function(){
	this.obj.addAt(0, this.mockPaintable);
	this.obj.addAt(0, this.anotherMock);
	this.obj.addAt(1, this.mockCollection);
	same(this.obj[0], this.anotherMock, "Another mock is still at position 0");
	same(this.obj[2], this.mockPaintable, "Mock moved to position 2");
	same(this.obj[1], this.mockCollection, "Collection mock at position 1");
});

test("succesfully add AddBefore anotherMock before mockCollecion", function(){
	this.obj.push(this.mockPaintable);
	this.obj.push(this.anotherMock);
	
	var thrown = false;
	try {
		this.obj.addBefore(this.mockCollection, this.anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "MockCollection is not in the collection yet");
	
	this.obj.addBefore(this.anotherMock, this.mockCollection);
	same(this.obj[0], this.mockPaintable);
	same(this.obj[1], this.mockCollection);
	same(this.obj[2], this.anotherMock);
	equals(this.obj.length, 3);
});

test("AddAfter", function(){
	this.obj.push(this.mockPaintable);
	this.obj.push(this.anotherMock);
	
	var thrown = false;
	try {
		this.obj.addAfter(this.mockPaintable, this.anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "MockCollection is not in the collection yet");
	
	this.obj.addBefore(this.anotherMock, this.mockCollection);
	same(this.obj[0], this.mockPaintable);
	same(this.obj[1], this.mockCollection);
	same(this.obj[2], this.anotherMock);
	equals(this.obj.length, 3);
});

test("Contains", function(){
	this.obj.push(this.mockPaintable);
	this.obj.push(this.mockCollection);
	
	ok(this.obj.contains(this.mockPaintable));
	ok(!this.obj.contains(this.anotherMock));
	ok(this.obj.contains(this.mockCollection));
});

test("Remove", 3, function(){
	this.obj.push(this.mockPaintable);
	this.obj.push(this.mockCollection);
	
	var thrown = false;
	try {
		this.obj.remove(this.anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "anotherMock is not in the collection yet");
	
	ok(this.obj.contains(this.mockPaintable));
	this.obj.remove(this.mockPaintable);
	ok(!this.obj.contains(this.mockPaintable));
});

test("Paint", 4, function(){
	var displayMock = {};
		
	this.obj.unshift(this.anotherMock);
	equals(this.obj.length, 1);
	this.obj.paint(10, displayMock);
	
	equals(this.anotherMock.args.length, 2);
	equals(this.anotherMock.args[0], 10);
	same(this.anotherMock.args[1], displayMock);
});
