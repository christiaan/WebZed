module("Map Canvas", {
	setup: function() {
		this.tiles = [];
		this.tiles.length = 300;
		this.tilesets = [];
		this.map = {
			width : 20,
			height : 15,
			tileWidth : 16,
			tileHeight : 16,
			tiles : this.tiles,
			tilesets: this.tilesets
		};
		this.canvas = {
			width : 320,
			height: 240
		};
	}
});

test("throw error if map width does not correspond with canvas", function(){
	var thrown = false;
	this.canvas.width = 321;
	try {
		new MapCanvas(this.map, this.canvas);
	} catch (e) {
		thrown = e instanceof Error;
	}
	ok(thrown);
});

test("throw error if map height does not correspond with canvas", function() {
	var thrown = false;
	this.canvas.height = 2234;
	try {
		new MapCanvas(this.map, this.canvas);
	} catch (e) {
		thrown = e instanceof Error;
	}
	ok(thrown);
});

