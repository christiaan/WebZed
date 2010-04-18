module("Object Pool", {
	setup : function() {
		this.mockClass = function(a) {
			this.a = a;
			this.args = arguments;
		};
		this.obj = new WebZed.ObjectPool(this.mockClass);
	}
});

test("throws an error on invalid target class", function() {
	var thrown = false;
	try {
		new WebZed.ObjectPool("");
	} catch (e) {
		thrown = true;
	}
	ok(thrown);
});

test("create creates a new instance of the given class", function() {
	var obj = this.obj.create();
	ok(obj instanceof this.mockClass);
});

test("a created object has active set true", function() {
	var obj = this.obj.create();
	equals(obj.active, true);
});

test("a recycled object has active set to false", function() {
	var obj = this.obj.create();
	this.obj.recycle(obj);
	equals(obj.active, false);
});

test("an exeption is thrown if trying to recycle a recycled object", function() {
	var obj = this.obj.create();
	this.obj.recycle(obj);
	var thrown = false;
	try {
		this.obj.recycle(obj);
	} catch (e) {
		thrown = true;
	}
	ok(thrown);
});

test("create passes the arguments along to the class constructor", function() {
	var obj = this.obj.create("some argument");
	equals(obj.a, "some argument");
});

test("create passes an arbitrary amount of arguments along to the constructor", function() {
	var obj = this.obj.create("een", "twee", 3, "vier", {vijf: 5}, 6);
	equals(obj.args[5], 6);
});

test("augment augments the class with the create function", function() {
	this.obj.augment();
	var obj =  this.mockClass.create();
	ok(obj instanceof this.mockClass);
});

test("augmented classes have a recycle method with just strip", function() {
	this.obj.augment();
	var obj = this.mockClass.create();
	obj.recycle();
	ok(!obj.active);
});

test("an exception is thrown when trying to recycle twice", function() {
	this.obj.augment();
	var obj = this.mockClass.create();
	obj.recycle();
	var thrown = false;
	try {
		obj.recycle();
	} catch (e) {
		thrown = true;
	}
	ok(thrown);
});

test("create recycle create will refurbish a object", function() {
	var obj = this.obj.create();
	this.obj.recycle(obj);
	var obj2 = this.obj.create();
	
	obj.test = "henk";
	equals(obj2.test, "henk");
});