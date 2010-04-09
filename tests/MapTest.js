module("Map", {
	setup: function() {
		this.tiles = [];
		this.tilesets = [];
		this.obj = new Map(20, 15, 16, 18, this.tiles, this.tilesets);
	},
	teardown: function() {
		delete this.obj;
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