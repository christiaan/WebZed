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
		node.width = width;
		node.height = height;
	}
	
	this._width = width;
	this._height = height;
	this._bgcolor = bgcolor;
	this._node = node;
	
	if(!("getContext" in node)) {
		throw new Error("Browser doesnt support Canvas.getContext()");
	}
	this._context = node.getContext("2d");
};

CanvasDisplay.prototype = {
	paintStart : function() {
		if(!this._bgcolor) {
			this._context.clearRect(0, 0, this._width, this._height);
		}
		else {
			// set the background color
			var prevFillstyle = this._context.fillStyle;
			this._context.fillStyle = this._bgcolor;
			this._context.fillRect(0, 0, this._width, this._height);
			this._context.fillStyle = prevFillstyle;
		}
	},
	paintEnd : function() {},
	paint : function(node, left, top, width, height, source_left, source_top) {
		this._context.drawImage(node, source_left, source_top, width, height,
			left, top, width, height);
	}
};