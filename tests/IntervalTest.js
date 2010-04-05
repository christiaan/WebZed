module("Interval", {
	setup: function() {
		this.callback = function() {
			this.args = arguments;
		};
		this.obj = new Interval(this.callback, 1000 / 30);
	}
});

test("throws an exception when given an invalid callback", function() {
	var thrown = false;
	try {
		new Interval("callback");
	} catch (e) {
		thrown = true;
	}
	ok(thrown);	
});

test("throws an exception when an invalid delay is given", function() {
	var thrown = false;
	try {
		new Interval(this.callback, "zeshonderd");
	} catch (e) {
		thrown = true;
	}
	ok(thrown);
});

test("type error thrown if elapsed is set but no Number", function() {
	var thrown = false;
	try {
		new Interval(this.callback, 1000/30, "tweehonderd");
	} catch (e) {
		thrown = true;
	}
	ok(thrown);
});

test("Interval is not started when just created", function() {
	ok(!this.obj.started);
});

test("Start the Interval", function() {
	this.obj.start();
	ok(this.obj.started);
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
