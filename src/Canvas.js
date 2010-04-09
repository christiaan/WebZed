/**
 * Canvas wrapper class
 * @param {Number} width
 * @param {Number} height
 * @constructor
 */
function Canvas(width, height) {
	this.node = document.createElement("canvas");
	if(!("getContext" in this.node)) {
		throw new Error("Browser doesnt support Canvas.getContext()");
	}
	this.context = this.node.getContext("2d");
	
	this.resize(width, height);
};

Canvas.prototype = {
	/**
	 * Resizes the display to the given dimensions
	 * @param {Number} width
	 * @param {Number} height
	 */
	resize : function(width, height) {
		if(width.constructor !== Number) {
			throw new TypeError("Width should be a Number");
		}
		if(height.constructor !== Number) {
			throw new TypeError("Height should be a Number");
		}
		this.width = width;
		this.height = height;
		this.node.width = width;
		this.node.height = height;
	},
	/**
	 * Fills the canvas with the given color
	 * @param {String} color hex color or undefined for transparent
	 */
	fill : function(color) {
		if(!color) {
			// According to W3C spec the canvas should be wiped clean
			// when the dimensions are being assigned
			this.node.width = this.node.width;
			// this.context.clearRect(0, 0, this.width, this.height);
		}
		else {
			// set the background color
			var prevFillstyle = this.context.fillStyle;
			this.context.fillStyle = this.bgcolor;
			this.context.fillRect(0, 0, this.node.width, this.node.height);
			this.context.fillStyle = prevFillstyle;
		}
	},
	/**
	 * Wrapper around context.drawImage this one allows you to draw over and on
	 * the edges without issuing an Error
	 * @param {DOMnode} node
	 * @param {Number} left
	 * @param {Number} top
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} sourceLeft
	 * @param {Number} sourceTop
	 * @return bool tells if the image was drawn on the canvas
	 */
	drawImage : function(node, left, top, width, height, sourceLeft, sourceTop) {
		
		// Do we try to draw at a position outside of the layer
		if(left < 0) {
			if(left + width < 0) {
				return false;
			}
			var px = 0 - left; // Amount we're overdue
			width -= px;// Cut it off the width
			sourceLeft += px;
			left = 0;
		}
		// If the image get drawn completely outside skip it
		else if(left > this.width) {
			return false;
		}
		else if(left + width > this.width) {
			width = this.width - left; // Width is the remaining width
		}
		
		if(top < 0) {
			if(top + height < 0) {
				return false;
			}
			var px = (0 - top); // Amount we're overdue
			height -= px;// Cut it off the height
			sourceTop += px;
			top = 0;
		}
		else if(top > this.height) {
			return false;
		}
		else if(top + height > this.height) {
			height = this.height - top;// Height is the remaining width
		}
		
		if(!width || !height) {
			return false;
		}
		
		this.context.drawImage(node, sourceLeft, sourceTop, width, height,
			left, top, width, height);
		return true;
	}
};