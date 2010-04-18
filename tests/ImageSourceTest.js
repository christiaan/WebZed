module("ImageSource");
test("Constructor", 15, function(){
	var mockNode = {
		nodeName : "IMG",
		complete : true,
		width : 600,
		height : 300
	};
	var thrown = false;
	try {
		new WebZed.ImageSource();
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "need a node");
	
	thrown = false;
	try {
		new WebZed.ImageSource({nodeName : "A"});
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "need width");
	
	thrown = false;
	try {
		new WebZed.ImageSource({nodeName : "A"}, 100);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "need height");
	
	thrown = false;
	try {
		new WebZed.ImageSource({nodeName : "A"}, 100, 200);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "node should be a img or canvas");
	
	thrown = false;
	try {
		new WebZed.ImageSource({nodeName : "IMG"}, 200, 100);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "node of type img should be completed");
	
	thrown = false;
	try {
		new WebZed.ImageSource({nodeName : "IMG", complete : true}, 100, 200);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "node should have valid dimensions");
	
	thrown = false;
	try {
		new WebZed.ImageSource(mockNode, "100", "200");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Width should be a number");
	
	thrown = false;
	try {
		new WebZed.ImageSource(mockNode, 100, "200");
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Height should be a number");
	
	thrown = false;
	try {
		new WebZed.ImageSource(mockNode, 450, 200);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Width should fit in the nodes width");
	
	thrown = false;
	try {
		new WebZed.ImageSource(mockNode, 100, 200);
	} catch (e) {
		thrown = true;
	}
	ok(thrown, "Height should fit in the nodes height");
	
	thrown = false;
	try {
		var obj = new WebZed.ImageSource(mockNode, 200, 100);
	} catch (e) {
		alert(e);
		thrown = true;
	}
	ok(!thrown, "Succesfully create a ImageSource");
	same(obj.node, mockNode, "Node is the same mockNode");
	equals(obj.width, 200, "Width is sucessfully set");
	equals(obj.height, 100, "Height is set");

	mockNode.nodeName = "CANVAS";
	thrown = false;
	try {
		obj = new WebZed.ImageSource(mockNode, 200, 100);
	} catch (e) {
		alert(e);
		thrown = true;
	}
	ok(!thrown, "Succesfully create a ImageSource with a CANVAS node");
});