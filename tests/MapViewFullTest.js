module("Map View Full Construction", {
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
	var thrown = false, obj;
	this.canvas.width = 321;
	try {
		obj = new WebZed.MapViewFull(this.map, this.canvas);
	} catch (e) {
		thrown = e instanceof Error;
	}
	ok(thrown);
});

test("throw error if map height does not correspond with canvas", function() {
	var thrown = false, obj;
	this.canvas.height = 2234;
	try {
		obj = new WebZed.MapViewFull(this.map, this.canvas);
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
	
	this.mockMap = {
		width : 20,
		height : 15,
		tileWidth : 16,
		tileHeight : 16,
		tiles : this.tiles,
		tilesets : this.tilesets,
		paintTile: function() {
			this.args.push(arguments);
		},
		args : []
	};
	this.mockDisplay = {
		width: 320,
		height: 240,
		paintStart: function() {
			this.paintStart.args = arguments;
		},
		paintEnd: function() {
			this.paintEnd.args = arguments;
		},
		paintImage: function(){}
	};
	this.obj = new WebZed.MapViewFull(this.mockMap, this.mockDisplay);
	this.obj.paintMap();
}});

test("paintMap calls paintStart", function() {
	ok(this.mockDisplay.paintStart.args);
});

test("paintMap calls paintEnd", function() {
	ok(this.mockDisplay.paintEnd.args);
});

test("paintMap calls paintTile for all tiles on map", function() {
	equals(this.mockMap.args.length, 300);
});

test("paintMap passes the x and y coordinate", function() {
	equals(this.mockMap.args[0][0], 0);
	equals(this.mockMap.args[0][1], 0);
	
	equals(this.mockMap.args[299][0], 19); // width -1
	equals(this.mockMap.args[299][1], 14); // height -1
});

test("paintMap passes the display to the map", function() {
	same(this.mockMap.args[0][2], this.mockDisplay);
	same(this.mockMap.args[299][2], this.mockDisplay);
});

test("paintMap passes the left and top offsets", function() {
	equals(this.mockMap.args[0][3], 0);
	equals(this.mockMap.args[0][4], 0);
	
	equals(this.mockMap.args[299][3], 304); // width -16
	equals(this.mockMap.args[299][4], 224); // height -16
});
