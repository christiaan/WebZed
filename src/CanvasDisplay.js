/**
 * A Display implemented with Canvas
 * @constructor
 * @type DisplayInterface
 * @param width
 * @param height
 * @param bgcolor
 * @param node
 */
function CanvasDisplay(width, height, bgcolor) {
	this.canvas = new Canvas(width, height);	
	this.bgcolor = bgcolor;
};

CanvasDisplay.prototype = {
	/**
	 * Called before a paint run
	 */
	paintStart : function() {
		this.canvas.fill(this.bgcolor);
	},
	/**
	 * Called after a paint run
	 */
	paintEnd : function() {
		// if we're using a back buffer we can copy it to the output here
	},
	paintImage : function(node, left, top, width, height, sourceLeft, sourceTop) {
		return this.canvas.drawImage(node, left, top, width, height, sourceLeft, sourceTop);
	}
};