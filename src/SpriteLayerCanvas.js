/**
 * A Sprite Layer implemented using HTML 5 Canvas
 * @constructor
 * @base SpriteLayerAbstract
 */
function SpriteLayerCanvas(width, height, fps, bgcolor, node) {
	if(!node) {
		node = document.createElement("canvas");
		node.width = width;
		node.height = height;
	}
	
	SpriteLayerAbstract.call(this, width, height, fps, bgcolor, node);
};

SpriteLayerCanvas.prototype = new SpriteLayerAbstract();