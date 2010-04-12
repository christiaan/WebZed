function MapViewFull(map, display) {
	
	if(map.width * map.tileWidth !== display.width) {
		throw new Error("display width should correspond with map width");
	}
	if(map.height * map.tileHeight !== display.height) {
		throw new Error("display height should correspond with map height");
	}
	
	this.map = map;
	this.display = display;
};

MapViewFull.prototype = {
	/**
	 * Paint tiles on the canvas 
	 */
	paintMap : function() {
		this.display.paintStart();
		for(var y = 0; y < this.map.height; y++) {
			for(var x = 0; x < this.map.width; x++) {
				this.map.paintTile(
					x, y, this.display,
					x * this.map.tileWidth,
					y * this.map.tileHeight
				);
			}
		}
		this.display.paintEnd();
	}	
};