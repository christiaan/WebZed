module("Interval", {
	setup: function() {
		var callback = function() {
			callback.context = this;
			callback.args = arguments;
		};
	
		this.callback = callback; 
		this.obj = new WebZed.Interval(this.callback, 100);
	}
});

test("throws an exception when given an invalid callback", function() {
	var thrown = false, obj;
	try {
		obj = new WebZed.Interval("callback");
	} catch (e) {
		thrown = true;
	}
	ok(thrown && !obj);	
});

test("throws an exception when an invalid delay is given", function() {
	var thrown = false, obj;
	try {
		obj = new WebZed.Interval(this.callback, "zeshonderd");
	} catch (e) {
		thrown = true;
	}
	ok(thrown && !obj);
});

test("type error thrown if elapsed is set but no Number", function() {
	var thrown = false, obj;
	try {
		obj = new WebZed.Interval(this.callback, 100, "tweehonderd");
	} catch (e) {
		thrown = true;
	}
	ok(thrown && !obj);
});

test("Interval is not started when just created", function() {
	ok(!this.obj.started);
});

test("Interval throw exception when stopping and not started", function() {
	var thrown = false;
	try {
		this.obj.stop();
	} catch (e) {
		thrown = true;
	}
	ok(thrown);
});

test("Interval can be stopped when it has been started", function() {
	this.obj.start();
	this.obj.stop();
	ok(!this.obj.started);
});

test("callback is called within the context of the interval", function() {
	this.obj.update(0);
	same(this.callback.context, this.obj);
});

test("callback is called with incrementing delay", function() {
	this.obj.elapsed = 0;
	this.obj.update(0);
	equals(this.callback.args[0], 100);
});

test("elapsed gets incremented on each update call", function() {
	this.obj.elapsed = 0;
	this.obj.update(0);
	this.obj.update(0);
	equals(this.callback.args[0], 200);
});

test("elapsed gets incremented by delay and overdue", function() {
	this.obj.elapsed = 0;
	this.obj.update(10);
	this.obj.update(-5);
	equals(this.obj.elapsed, 205);
});