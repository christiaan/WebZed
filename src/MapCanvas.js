function MapCanvas(map, canvas) {
	
	if(map.width * map.tileWidth !== canvas.width) {
		throw new Error("canvas width should correspond with map width");
	}
	if(map.height * map.tileHeight !== canvas.height) {
		throw new Error("canvas height should correspond with map height");
	}
	
	this.map = map;
	this.canvas = canvas;
};

MapCanvas.prototype = {
	/**
	 * Paint tiles on the canvas 
	 */
	paintTiles : function() {
		for(var i = 0; i < this.map.tiles.length; i++) {
			var left, top, srcLeft, srcTop, srcNode;
			left = (i % this.width) * this.tileWidth;
			top = Math.floor(i / this.width) * this.tileHeight;
			
			var g = this.map.tiles[i];
			for(var t = 0; t < this.map.tilesets.length; t++) {
				var tileset = this.map.tilesets[t];
				var tilesetWidth = (tileset.width / this.tileWidth);
				var count = (tilesetWidth * (tileset.height / this.tileHeight));
				if(g > count) {
					g -= count;
				}
				else {
					srcNode = tileset;
					srcLeft = (g % tilesetWidth) * this.tileWidth;
					srcTop = Math.floor(g / tilesetWidth) * this.tileHeight;
				}
			}
			
			if(srcNode) {
				this.canvas.drawImage(srcNode, left, top,
					this.tileWidth, this.tileHeight, srcLeft, srcTop);
			}
			else {
				throw new Error("tile with unknown tileid "+g);
			}
		}
	}	
};