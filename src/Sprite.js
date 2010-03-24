/**
 * 
 * @constructor
 */
function Sprite(image, left, top, zindex) {
	if(!image || !(image instanceof ImageSource)) {
		throw new TypeError("image should be a ImageSource object");
	}
	
	this.image = image;
	this.left = left;
	this.top = top;
	this.zindex = zindex;
};

Sprite.prototype = {
	draw : function(canvas){}
};