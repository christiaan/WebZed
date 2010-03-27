module("ImageSource");
test("Constructor", 25, function(){
	var mockNode = {
		nodeName : "IMG",
		complete : true,
		width : 600,
		height : 300
	};
	var thrown = false;
	try {
		new ImageSource();
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "need a node");
	
	thrown = false;
	try {
		new ImageSource({nodeName : "A"});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "need width");
	
	thrown = false;
	try {
		new ImageSource({nodeName : "A"}, 100);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "need height");
	
	thrown = false;
	try {
		new ImageSource({nodeName : "A"}, 100, 200);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "node should be a img or canvas");
	
	thrown = false;
	try {
		new ImageSource({nodeName : "IMG"}, 200, 100);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "node of type img should be completed");
	
	thrown = false;
	try {
		new ImageSource({nodeName : "IMG", complete : true}, 100, 200);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "node should have valid dimensions");
	
	thrown = false;
	try {
		new ImageSource(mockNode, "100", "200");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Width should be a number");
	
	thrown = false;
	try {
		new ImageSource(mockNode, 100, "200");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Height should be a number");
	
	thrown = false;
	try {
		new ImageSource(mockNode, 450, 200);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Width should fit in the nodes width");
	
	thrown = false;
	try {
		new ImageSource(mockNode, 100, 200);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Height should fit in the nodes height");
	
	thrown = false;
	try {
		new ImageSource(mockNode, 100, 200, "fast");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Speed should be a number");
	
	thrown = false;
	try {
		new ImageSource(mockNode, 100, 200, 333, "diagonal");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Direction should be vertical or horizontal");
	
	thrown = false;
	try {
		var obj = new ImageSource(mockNode, 200, 100);
	} catch (e) {
		alert(e);
		thrown = true;
	}
	ok(!thrown, "Succesfully create a ImageSource with minimum amount of params");
	same(obj.node, mockNode, "Node is the same mockNode");
	equals(obj.width, 200, "Width is sucessfully set");
	equals(obj.height, 100, "Height is set");
	equals(obj.speed, 0, "Speed is zero by default");
	equals(obj.direction, ImageSource.vertical, "Direction is by default vertical");
	
	thrown = false;
	try {
		obj = new ImageSource(mockNode, 200, 100, 333, ImageSource.horizontal);
	} catch (e) {
		alert(e);
		thrown = true;
	}
	ok(!thrown, "Succesfully create a ImageSource with all params");
	same(obj.node, mockNode, "Node is the same mockNode");
	equals(obj.width, 200, "Width is sucessfully set");
	equals(obj.height, 100, "Height is set");
	equals(obj.speed, 333, "Speed is set");
	equals(obj.direction, ImageSource.horizontal, "Direction is set");
	
	mockNode.nodeName = "CANVAS";
	thrown = false;
	try {
		obj = new ImageSource(mockNode, 200, 100, 333, ImageSource.horizontal);
	} catch (e) {
		alert(e);
		thrown = true;
	}
	ok(!thrown, "Succesfully create a ImageSource with a CANVAS node");
});