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

module("Map paintTile() on display", {setup: function() {
	this.tiles = [];
	this.tiles.length = 300;
	this.tilesets = [];
	this.mockDisplay = {
		paintImage: function() {
			this.args.push(arguments);
		},
		args: []
	};
	this.obj = new Map(20, 15, 16, 16, this.tiles, this.tilesets);
}});

test("throws an error when an unknown gid is encountered", function() {
	this.tiles[0] = 400;
	var thrown = false;
	try {
		this.obj.paintTile(0, 0, this.mockDisplay, 0, 0);
	} catch (e) {
		thrown = e instanceof Error;
	}
	ok(thrown);
});

test("skips tiles with a gid that evaluates to false", function() {
	this.obj.paintTile(0, 0, this.mockDisplay, 0, 0);
	equals(this.mockDisplay.args.length, 0);
});

//test("paint draws the tiles on the canvas using drawImage", function() {
//	this.tiles[299] = 4;
//	this.obj.paintMap();
//	
//	equals(this.canvas.args.length, 1);
//	equals(this.canvas.args[0].length, 7);
//	
//	same(this.canvas.args[0][0], this.tilesetMock);
//	equals(this.canvas.args[0][1], (299 % 20) * 16);
//	equals(this.canvas.args[0][2], Math.floor(299 / 20) * 16);
//	equals(this.canvas.args[0][3], 16);
//	equals(this.canvas.args[0][4], 16);
//	equals(this.canvas.args[0][5], (4 % (640 / 16)) * 16);
//	equals(this.canvas.args[0][6], 0);
//});