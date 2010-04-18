function Map(width, height, tileWidth, tileHeight, tiles, tilesets) {
	var i, count = 0;
	
	if (width * height !== tiles.length) {
		throw new Error("Not enough tiles to fill the map with");
	}
		
	for (i = 0; i < tilesets.length; i += 1) {
		count += ((tilesets[i].width / tileWidth) *
			(tilesets[i].height / tileHeight));
	}
	
	for (i = 0; i < tiles.length; i += 1) {
		if (tiles[i] > count) {
			throw new Error("Tileset missing for tile with gid " + tiles[i]);
		}
	}
	
	this.width = width;
	this.height = height;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	
	this.tiles = tiles;
	this.tilesets = tilesets;
}

Map.prototype = {
	paintTile: function (left, top, display, leftOffset, topOffset) {
		var gid = this.tiles[(top * this.width) + left],
		srcNode, srcLeft, srcTop, t, tileset, tilesetWidth, count;
		if (!gid) {
			return;
		}
		
		for (t = 0; t < this.tilesets.length; t += 1) {
			tileset = this.tilesets[t];
			tilesetWidth = (tileset.width / this.tileWidth);
			count = (tilesetWidth * (tileset.height / this.tileHeight));
			if (gid > count) {
				gid -= count;
				srcNode = false;
			}
			else {
				srcNode = tileset;
				srcLeft = (gid % tilesetWidth) * this.tileWidth;
				srcTop = Math.floor(gid / tilesetWidth) * this.tileHeight;
			}
		}
		
		if (!srcNode) {
			throw new Error("no tileset found for gid " + gid);
		}
		display.paintImage(srcNode, leftOffset, topOffset,
			this.tileWidth, this.tileHeight, srcLeft, srcTop);
	}
};