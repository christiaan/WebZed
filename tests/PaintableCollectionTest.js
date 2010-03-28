(function(){
var mockPaintable = {"paint" : function(){}};

module("PaintableCollection");
test("Constructor", 5, function(){
	var thrown = false;
	try {
		new PaintableCollection({"paint" : function(){}});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "First arg should be a array");
	
	thrown = false;
	try {
		new PaintableCollection([]);
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "works with an empty array");
	
	thrown = false;
	try {
		var obj = new PaintableCollection();
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "All args are optional");
	ok(obj instanceof Array, "Created Collection is also an Array");
	
	thrown = false;
	try {
		new PaintableCollection(obj);
	} catch (e) {
		thrown = true;
	}
	ok(!thrown, "works with another PaintableCollection");
});

test("Push", 11, function(){
	var obj = new PaintableCollection();
	
	var thrown = false;
	try {
		obj.push({});
	} catch (e)	{
		thrown = true;
	}
	ok(thrown, "arg should implement PaintableInterface");

	thrown = false;
	try {
		obj.push(mockPaintable);
	} catch (e)	{
		thrown = true;
	}
	equals(obj.length, 1, "paintables are accepted");
	same(obj[0], mockPaintable, "mock is the first entry");
	
	var mockCollection = new PaintableCollection();
	obj.push(mockCollection);
	equals(obj.length, 2, "Another Collection is accepted as well");
	same(obj[1], mockCollection, "Collection is added at the end");
	same(obj[0], mockPaintable, "mock is still the first entry");
	
	var newobj = new PaintableCollection(obj);
	equals(obj.length, 2, "On construct the paintables get pushed");
	same(newobj, obj, "Constructing a new Collection with another collection result in the same contents");
	same(obj[0], mockPaintable, "mock is still the first entry");
	same(obj[1], mockCollection, "Collection is at the end");
	
	thrown = false;
	try {
		newobj.push(mockPaintable);
	} catch(e) {
		thrown = true;
	}
	ok(thrown, "Collection entries have to be unique");
});

test("Unshift", 7, function(){
	var obj = new PaintableCollection();
	
	var thrown = false;
	try {
		obj.unshift({});
	} catch (e)	{
		thrown = true;
	}
	ok(thrown, "arg should implement PaintableInterface");
	
	obj.unshift(mockPaintable);
	equals(obj.length, 1, "Paintable is the only item");
	same(obj[0], mockPaintable, "Paintable is first item");
	
	var mockCollection = new PaintableCollection();
	obj.unshift(mockCollection);
	equals(obj.length, 2, "We got 2 items now");
	same(obj[1], mockPaintable, "Paintable is 2nd item now");
	same(obj[0], mockCollection, "Collection is the first item");
	
	thrown = false;
	try {
		obj.unshift(mockPaintable);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Paintable has to be unique in the collection");
});

test("AddAt", 9, function(){
	var obj = new PaintableCollection();
	
	var thrown = false;
	try {
		obj.addAt();
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "position should be a Number");

	thrown = false;
	try {
		obj.addAt(mockPaintable);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "position should be a Number");
	
	thrown = false;
	try {
		obj.addAt(0, {});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "paintable should implement PaintableInterface");
	
	obj.addAt(0, mockPaintable);
	same(obj[0], mockPaintable, "Added at position 0");
	
	var anotherMock = {"paint" : function(){}};
	obj.addAt(0, anotherMock);
	same(obj[0], anotherMock, "Another mock added at position 0");
	same(obj[1], mockPaintable, "Mock moved 1 position");
	
	var mockCollection = new PaintableCollection();
	obj.addAt(1, mockCollection);
	same(obj[0], anotherMock, "Another mock is still at position 0");
	same(obj[2], mockPaintable, "Mock moved to position 2");
	same(obj[1], mockCollection, "Collection mock at position 1");
});

test("AddBefore", 5, function(){
	var obj = new PaintableCollection();
	var anotherMock = {"paint" : function(){}};
	var mockCollection = new PaintableCollection();
	
	obj.push(mockPaintable);
	obj.push(anotherMock);
	
	var thrown = false;
	try {
		obj.addBefore(mockCollection, anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "MockCollection is not in the collection yet");
	
	obj.addBefore(anotherMock, mockCollection);
	same(obj[0], mockPaintable);
	same(obj[1], mockCollection);
	same(obj[2], anotherMock);
	equals(obj.length, 3);
});

test("AddAfter", 5, function(){
	var obj = new PaintableCollection();
	var anotherMock = {"paint" : function(){}};
	var mockCollection = new PaintableCollection();
	
	obj.push(mockPaintable);
	obj.push(anotherMock);
	
	var thrown = false;
	try {
		obj.addAfter(mockPaintable, anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "MockCollection is not in the collection yet");
	
	obj.addBefore(anotherMock, mockCollection);
	same(obj[0], mockPaintable);
	same(obj[1], mockCollection);
	same(obj[2], anotherMock);
	equals(obj.length, 3);
});

test("Contains", 3, function(){
	var obj = new PaintableCollection();
	var anotherMock = {"paint" : function(){}};
	var mockCollection = new PaintableCollection();
	
	obj.push(mockPaintable);
	obj.push(mockCollection);
	
	ok(obj.contains(mockPaintable));
	ok(!obj.contains(anotherMock));
	ok(obj.contains(mockCollection));
});

test("Remove", 3, function(){
	var obj = new PaintableCollection();
	var anotherMock = {"paint" : function(){}};
	var mockCollection = new PaintableCollection();
	
	obj.push(mockPaintable);
	obj.push(mockCollection);
	
	var thrown = false;
	try {
		obj.remove(anotherMock);		
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "anotherMock is not in the collection yet");
	
	ok(obj.contains(mockPaintable));
	obj.remove(mockPaintable);
	ok(!obj.contains(mockPaintable));
});

test("Paint", 4, function(){
	var obj = new PaintableCollection();
	var anotherMock = {"paint" : function(){this.args = arguments;}};
	var displayMock = {};
		
	obj.unshift(anotherMock);
	equals(obj.length, 1);
	obj.paint(10, displayMock);
	
	equals(anotherMock.args.length, 2);
	equals(anotherMock.args[0], 10);
	same(anotherMock.args[1], displayMock);
});
})();