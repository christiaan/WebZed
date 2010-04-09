module("Map Canvas", {
	setup: function() {
		this.tiles = [];
		this.tilesets = [];
		this.map = new Map(20, 15, 16, 16, this.tiles, this.tilesets);
		this.canvas = new Canvas(320, 240);
		this.obj = new MapCanvas(this.map, this.canvas);
	}
});

test("throw error if map width does not correspond with canvas", function(){
	var thrown = false;
	this.canvas.resize(321, 240);
	try {
		new MapCanvas(this.map, this.canvas);
	} catch (e) {
		thrown = e instanceof Error;
	}
	ok(thrown);
});

test("throw error if map height does not correspond with canvas", function() {
	var thrown = false;
	this.canvas.resize(320, 2234);
	try {
		new MapCanvas(this.map, this.canvas);
	} catch (e) {
		thrown = e instanceof Error;
	}
	ok(thrown);
});