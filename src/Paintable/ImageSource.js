/**
 * ImageSource class
 * 
 * @constructor
 * @param node The DOMnode being used
 * @param width width of a frame on the node
 * @param height height of a frame on the node
 */
function ImageSource(node, width, height) {
	if (!node || !node.nodeName) {
		throw new Error("No DOMnode given");
	}
	if (!width || width < 0) {
		throw new Error("No width given");
	}
	if (!height || height < 0) {
		throw new Error("No height given");
	}
	
	if (node.nodeName !== "IMG" && node.nodeName !== "CANVAS") {
		throw new TypeError("Node is not a img nor a canvas element");
	}
	if (node.nodeName === "IMG" && !node.complete) {
		throw new Error("Node is not finished loading yet");
	}
	
	if (!node.width || !node.height) {
		throw new Error("Node has no valid dimensions");
	}
	if (width.constructor !== Number) {
		throw new TypeError("Width should be a number");
	}
	if (height.constructor !== Number) {
		throw new TypeError("Height should be a number");
	}
	
	if (node.width % width !== 0) {
		throw new Error("DOMnode width and given width do not fit");
	}
	if (node.height % height !== 0) {
		throw new Error("DOMnode height and given height do not fit");
	}
	
	this.node = node;
	this.width = width;
	this.height = height;
	
	this.horizontalFrames = (this.node.width / this.width) - 1;
	this.verticalFrames = (this.node.height / this.height) - 1;
}

ImageSource.vertical = "vertical";
ImageSource.horizontal = "horizontal";