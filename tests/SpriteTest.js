module("Sprite");
test("Constructor", function(){
	var img = new ImageSource();
	img.src = "../media/img/planets/arctic.png";
	
	var tmp = new Sprite(img, 16, 32);
	
	same(tmp.node, img, "Img is set as source");
	equals(tmp.height, 16, "Height is sucessfully set");
	equals(tmp.width, 32, "Width is succesfully set");
});