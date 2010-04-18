WebZed.MapViewFull = function (map, display) {
	
	if (map.width * map.tileWidth !== display.width) {
		throw new Error("display width should correspond with map width");
	}
	if (map.height * map.tileHeight !== display.height) {
		throw new Error("display height should correspond with map height");
	}
	
	this.map = map;
	this.display = display;
};

WebZed.MapViewFull.prototype = {
	/**
	 * Paint tiles on the canvas 
	 */
	paintMap : function () {
		var y, x;
	
		this.display.paintStart();
		for (y = 0; y < this.map.height; y += 1) {
			for (x = 0; x < this.map.width; x += 1) {
				this.map.paintTile(
					x, y, this.display,
					x * this.map.tileWidth,
					y * this.map.tileHeight);
			}
		}
		this.display.paintEnd();
	}	
};
