module("Map constructor throws", {
	setup: function() {
		this.tiles = [];
		this.tilesets = [];
	}
});

test("a Error when there are not enough tiles to fill the map", function() {
	var thrown = false;
	try {
		new Map(20, 15, 16, 16, this.tiles, this.tilesets);
	} catch (e) {
		thrown = e instanceof Error;
	}
	ok(thrown);
});

test("a Error when there are tiles with tile id's not in the tilesets", function() {
	var thrown = false;
	this.tiles.length = 100;
	this.tiles[3] = 4;
	try {
		new Map(10, 10, 16, 16, this.tiles, this.tilesets);
	} catch(e) {
		thrown = e instanceof Error;
	}
	ok(thrown);
});

module("Map constructor", {
	setup: function() {
		this.tiles = [];
		this.tiles.length = 300;
		this.tilesets = [];
		this.obj = new Map(20, 15, 16, 18, this.tiles, this.tilesets);
	}
});

test("width is correctly assigned", function(){
	equals(this.obj.width, 20);
});

test("height is correctly assigned", function(){
	equals(this.obj.height, 15);
});

test("tileWidth is correctly assigned", function() {
	equals(this.obj.tileWidth, 16);
});

test("tileHeight is correctly assigned", function() {
	equals(this.obj.tileHeight, 18);
});

test("tiles are correctly assigned", function() {
	same(this.obj.tiles, this.tiles);
});

test("tilesets are correctly assigned", function() {
	same(this.obj.tilesets, this.tilesets);
});