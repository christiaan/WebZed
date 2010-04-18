(function() {
var mockObj = {};

module("ObjectCollection");
test("Constructor", function() {
	var thrown = false;
	try {
		new WebZed.ObjectCollection({"paint" : function(){}});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "arg should be a array");
	
	thrown = false;
	try {
		new WebZed.ObjectCollection([]);
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "works with an empty array");
	
	thrown = false;
	try {
		var obj = new WebZed.ObjectCollection();
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "All args are optional");
	ok(obj instanceof Array, "Created ObjectCollection is also an Array");
	
	thrown = false;
	try {
		new WebZed.ObjectCollection(obj);
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "works with another ObjectCollection");
});


test("Push", 10, function(){
	var obj = new WebZed.ObjectCollection();
	
	var thrown = false;
	try {
		obj.push(mockObj);
	} catch (e)	{
		thrown = true;
	}
	equals(obj.length, 1, "objects are accepted");
	same(obj[0], mockObj, "mock is the first entry");
	
	var mockCollection = new WebZed.ObjectCollection();
	obj.push(mockCollection);
	equals(obj.length, 2, "Another Collection is accepted as well");
	same(obj[1], mockCollection, "Collection is added at the end");
	same(obj[0], mockObj, "mock is still the first entry");
	
	var newobj = new WebZed.ObjectCollection(obj);
	equals(obj.length, 2, "On construct the paintables get pushed");
	same(newobj, obj, "Constructing a new Collection with another collection result in the same contents");
	same(obj[0], mockObj, "mock is still the first entry");
	same(obj[1], mockCollection, "Collection is at the end");
	
	thrown = false;
	try {
		newobj.push(mockObj);
	} catch(e) {
		thrown = true;
	}
	ok(thrown, "Collection entries have to be unique");
});

test("Unshift", 6, function(){
	var obj = new WebZed.ObjectCollection();
	
	obj.unshift(mockObj);
	equals(obj.length, 1, "Mock is the only item");
	same(obj[0], mockObj, "Mock is first item");
	
	var mockCollection = new WebZed.ObjectCollection();
	obj.unshift(mockCollection);
	equals(obj.length, 2, "We got 2 items now");
	same(obj[1], mockObj, "Mock is 2nd item now");
	same(obj[0], mockCollection, "Collection is the first item");
	
	var thrown = false;
	try {
		obj.unshift(mockObj);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Item has to be unique in the collection");
});

test("AddAt", 8, function(){
	var obj = new WebZed.ObjectCollection();
	
	var thrown = false;
	try {
		obj.addAt();
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "position should be a Number");

	thrown = false;
	try {
		obj.addAt(mockObj);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "position should be a Number");
	
	obj.addAt(0, mockObj);
	same(obj[0], mockObj, "Added at position 0");
	
	var anotherMock = {"paint" : function(){}};
	obj.addAt(0, anotherMock);
	same(obj[0], anotherMock, "Another mock added at position 0");
	same(obj[1], mockObj, "Mock moved 1 position");
	
	var mockCollection = new WebZed.ObjectCollection();
	obj.addAt(1, mockCollection);
	same(obj[0], anotherMock, "Another mock is still at position 0");
	same(obj[2], mockObj, "Mock moved to position 2");
	same(obj[1], mockCollection, "Collection mock at position 1");
});

test("AddBefore", 5, function(){
	var obj = new WebZed.ObjectCollection();
	var anotherMock = {"paint" : function(){}};
	var mockCollection = new WebZed.ObjectCollection();
	
	obj.push(mockObj);
	obj.push(anotherMock);
	
	var thrown = false;
	try {
		obj.addBefore(mockCollection, anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "MockCollection is not in the collection yet");
	
	obj.addBefore(anotherMock, mockCollection);
	same(obj[0], mockObj);
	same(obj[1], mockCollection);
	same(obj[2], anotherMock);
	equals(obj.length, 3);
});

test("AddAfter", 5, function(){
	var obj = new WebZed.ObjectCollection();
	var anotherMock = {"paint" : function(){}};
	var mockCollection = new WebZed.ObjectCollection();
	
	obj.push(mockObj);
	obj.push(anotherMock);
	
	var thrown = false;
	try {
		obj.addAfter(mockObj, anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "MockCollection is not in the collection yet");
	
	obj.addBefore(anotherMock, mockCollection);
	same(obj[0], mockObj);
	same(obj[1], mockCollection);
	same(obj[2], anotherMock);
	equals(obj.length, 3);
});

test("Contains", 3, function(){
	var obj = new WebZed.ObjectCollection();
	var anotherMock = {"paint" : function(){}};
	var mockCollection = new WebZed.ObjectCollection();
	
	obj.push(mockObj);
	obj.push(mockCollection);
	
	ok(obj.contains(mockObj));
	ok(!obj.contains(anotherMock));
	ok(obj.contains(mockCollection));
});

test("Remove", 3, function(){
	var obj = new WebZed.ObjectCollection();
	var anotherMock = {"paint" : function(){}};
	var mockCollection = new WebZed.ObjectCollection();
	
	obj.push(mockObj);
	obj.push(mockCollection);
	
	var thrown = false;
	try {
		obj.remove(anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "anotherMock is not in the collection yet");
	
	ok(obj.contains(mockObj));
	obj.remove(mockObj);
	ok(!obj.contains(mockObj));
});

})();