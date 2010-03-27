/**
 * A Display implemented with Canvas
 * @constructor
 * @type DisplayInterface
 * @param width
 * @param height
 * @param bgcolor
 * @param node
 */
function CanvasDisplay(width, height, bgcolor, node) {
	if(width.constructor !== Number) {
		throw new TypeError("Width should be a Number");
	}
	if(height.constructor !== Number) {
		throw new TypeError("Height should be a Number");
	}
	if(!node) {
		node = document.createElement("canvas");
	}
	else if(!node.nodeName || node.nodeName.tolower() !== "canvas") {
		throw new TypeError("node should be a Canvas DOMnode");
	}
	if(!("getContext" in node)) {
		throw new Error("Browser doesnt support Canvas.getContext()");
	}
	
	node.width = width;
	node.height = height;
	
	this.width = width;
	this.height = height;
	this._bgcolor = bgcolor;
	this._node = node;
	
	this._context = node.getContext("2d");
};

CanvasDisplay.prototype = {
	/**
	 * Called before a paint run
	 */
	paintStart : function() {
		if(!this._bgcolor) {
			// According to W3C spec the canvas should be wiped clean
			// when the dimensions are being assigned
			this._node.width = this._node.width;
			// this._context.clearRect(0, 0, this.width, this.height);
		}
		else {
			// set the background color
			var prevFillstyle = this._context.fillStyle;
			this._context.fillStyle = this._bgcolor;
			this._context.fillRect(0, 0, this.width, this.height);
			this._context.fillStyle = prevFillstyle;
		}
	},
	/**
	 * Called after a paint run
	 */
	paintEnd : function() {
		// if we're using a back buffer we can copy it to the output here
	},
	paintImage : function(node, left, top, width, height, source_left, source_top) {
		
		// Do we try to draw at a position outside of the layer
		if(left < 0) {
			if(left + width < 0) {
				return false;
			}
			var px = (0 - left); // Amount we're overdue
			width -= px;// Cut it off the width
			source_left += px;
			left = 0;
		}
		// If the image get drawn completely outside skip it
		else if(left > this.width) {
			return false;
		}
		else if(left + width > this.width) {
			width = (this.width - left); // Width is the remaining width
		}
		
		if(top < 0) {
			if(top + height < 0) return false;
			var px = (0 - top); // Amount we're overdue
			height -= px;// Cut it off the height
			source_top += px;
			top = 0;
		}
		else if(top > this.height) {
			return false;
		}
		else if(top + height > this.height) {
			height = (this.height - top);// Height is the remaining width
		}
		
		if(!width || !height) {
			return false;
		}
		
		this._context.drawImage(node, source_left, source_top, width, height,
			left, top, width, height);
		return true;
	}
};