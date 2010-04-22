module("ObjectCollection", {
	setup : function() {
		this.mockObj = {};
		this.anotherMock = {"paint" : function(){}};
		this.mockCollection = new WebZed.ObjectCollection();
		
		this.obj = new WebZed.ObjectCollection();
	}
});
test("Constructor", function() {
	var thrown = false, obj;
	try {
		obj = new WebZed.ObjectCollection({"paint" : function(){}});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "arg should be a array");
	
	thrown = false;
	try {
		obj = new WebZed.ObjectCollection([]);
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "works with an empty array");
	
	thrown = false;
	try {
		obj = new WebZed.ObjectCollection();
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "All args are optional");
	ok(obj instanceof Array, "Created ObjectCollection is also an Array");
	
	thrown = false;
	try {
		obj = new WebZed.ObjectCollection(obj);
	} catch (e) {
		thrown = true;
	}
	ok(!thrown && obj, "works with another ObjectCollection");
});


test("Push", 10, function(){
	var thrown = false, newObj;
	try {
		this.obj.push(this.mockObj);
	} catch (e)	{
		thrown = true;
	}
	equals(this.obj.length, 1, "objects are accepted");
	same(this.obj[0], this.mockObj, "mock is the first entry");
	
	this.obj.push(this.mockCollection);
	equals(this.obj.length, 2, "Another Collection is accepted as well");
	same(this.obj[1], this.mockCollection, "Collection is added at the end");
	same(this.obj[0], this.mockObj, "mock is still the first entry");
	
	newObj = new WebZed.ObjectCollection(this.obj);
	equals(this.obj.length, 2, "On construct the paintables get pushed");
	same(newObj, this.obj, "Constructing a new Collection with another collection result in the same contents");
	same(this.obj[0], this.mockObj, "mock is still the first entry");
	same(this.obj[1], this.mockCollection, "Collection is at the end");
	
	thrown = false;
	try {
		newObj.push(this.mockObj);
	} catch(e) {
		thrown = true;
	}
	ok(thrown, "Collection entries have to be unique");
});

test("Unshift a mock object", function(){
	this.obj.unshift(this.mockObj);
	equals(this.obj.length, 1, "Mock is the only item");
	same(this.obj[0], this.mockObj, "Mock is first item");
});

test("Unshift a mock object twice will throw exception", function() {
	this.obj.unshift(this.mockObj);
	var thrown = false;
	try {
		this.obj.unshift(this.mockObj);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Item has to be unique in the collection");
});

test("Unshift another Collection", function(){
	this.obj.unshift(this.mockObj);
	this.obj.unshift(this.mockCollection);
	equals(this.obj.length, 2, "We got 2 items now");
	same(this.obj[1], this.mockObj, "Mock is 2nd item now");
	same(this.obj[0], this.mockCollection, "Collection is the first item");
});

test("AddAt", 8, function(){
	var thrown = false;
	try {
		this.obj.addAt();
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "position should be a Number");

	thrown = false;
	try {
		this.obj.addAt(this.mockObj);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "position should be a Number");
	
	this.obj.addAt(0, this.mockObj);
	same(this.obj[0], this.mockObj, "Added at position 0");
	
	this.obj.addAt(0, this.anotherMock);
	same(this.obj[0], this.anotherMock, "Another mock added at position 0");
	same(this.obj[1], this.mockObj, "Mock moved 1 position");
	
	this.obj.addAt(1, this.mockCollection);
	same(this.obj[0], this.anotherMock, "Another mock is still at position 0");
	same(this.obj[2], this.mockObj, "Mock moved to position 2");
	same(this.obj[1], this.mockCollection, "Collection mock at position 1");
});

test("AddBefore", 5, function(){
	this.obj.push(this.mockObj);
	this.obj.push(this.anotherMock);
	
	var thrown = false;
	try {
		this.obj.addBefore(this.mockCollection, this.anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "MockCollection is not in the collection yet");
	
	this.obj.addBefore(this.anotherMock, this.mockCollection);
	same(this.obj[0], this.mockObj);
	same(this.obj[1], this.mockCollection);
	same(this.obj[2], this.anotherMock);
	equals(this.obj.length, 3);
});

test("AddAfter", 5, function(){
	this.obj.push(this.mockObj);
	this.obj.push(this.anotherMock);
	
	var thrown = false;
	try {
		this.obj.addAfter(this.mockObj, this.anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "MockCollection is not in the collection yet");
	
	this.obj.addBefore(this.anotherMock, this.mockCollection);
	same(this.obj[0], this.mockObj);
	same(this.obj[1], this.mockCollection);
	same(this.obj[2], this.anotherMock);
	equals(this.obj.length, 3);
});

test("Contains", 3, function(){
	this.obj.push(this.mockObj);
	this.obj.push(this.mockCollection);
	
	ok(this.obj.contains(this.mockObj));
	ok(!this.obj.contains(this.anotherMock));
	ok(this.obj.contains(this.mockCollection));
});

test("Remove", 3, function(){
	this.obj.push(this.mockObj);
	this.obj.push(this.mockCollection);
	
	var thrown = false;
	try {
		this.obj.remove(this.anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "anotherMock is not in the collection yet");
	
	ok(this.obj.contains(this.mockObj));
	this.obj.remove(this.mockObj);
	ok(!this.obj.contains(this.mockObj));
});
