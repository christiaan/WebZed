module("Map Canvas Construction", {
	setup: function() {
		this.tiles = [];
		this.tilesets = [];
		this.map = {
			width : 20,
			height : 15,
			tileWidth : 16,
			tileHeight : 16
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

module("Map Canvas with a valid map and canvas", { setup: function() {
	this.tiles = [];
	this.tiles.length = 300;
	this.tilesetMock = {
		width: 640,
		height: 480
	};
	this.tilesets = [this.tilesetMock];
	
	this.map = {
		width : 20,
		height : 15,
		tileWidth : 16,
		tileHeight : 16,
		tiles : this.tiles,
		tilesets : this.tilesets
	};
	this.canvas = {
		width : 320,
		height: 240,
		drawImage: function() {
			this.args.push(arguments);
		},
		args : []
	};
	this.obj = new MapCanvas(this.map, this.canvas);
}});

test("paint skips tiles with tileid 0 or undefined", function() {
	this.obj.paintTiles();
	equals(this.canvas.args.length, 0);
});

test("paint draws the tiles on the canvas using drawImage", function() {
	this.tiles[299] = 4;
	this.obj.paintTiles();
	
	equals(this.canvas.args.length, 1);
	equals(this.canvas.args[0].length, 7);
	
	same(this.canvas.args[0][0], this.tilesetMock);
	equals(this.canvas.args[0][1], (299 % 20) * 16);
	equals(this.canvas.args[0][2], Math.floor(299 / 20) * 16);
	equals(this.canvas.args[0][3], 16);
	equals(this.canvas.args[0][4], 16);
	equals(this.canvas.args[0][5], (4 % (640 / 16)) * 16);
	equals(this.canvas.args[0][6], 0);
});