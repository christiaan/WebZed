function Map(width, height, tileWidth, tileHeight, tiles, tilesets) {
	
	if(width * height !== tiles.length) {
		throw new Error("Not enough tiles to fill the map with");
	}
	
	var i, count = 0;
	
	for(i = 0; i < tilesets.length; i++) {
		count += ((tilesets[i].width / tileWidth) *
			(tilesets[i].height / tileHeight));
	}
	
	for(i = 0; i < tiles.length; i++) {
		if(tiles[i] > count) {
			throw new Error("Tileset missing for tile with gid "+tiles[i]);
		}
	}
	
	this.width = width;
	this.height = height;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	
	this.tiles = tiles;
	this.tilesets = tilesets;
};

Map.prototype = {

};