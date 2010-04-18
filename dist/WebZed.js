var WebZed = (function(){
var WebZed = {};
WebZed.bind = function (obj, func) {
	if(func.constructor === String) {
		func = obj[func];
	}
	if(!(func instanceof Function)) {
		throw new TypeError("func should be a Function");
	}
	return function() {
		return func.apply(obj, arguments);
	};
};
/**
 * Originally from the js design patterns book
 * @link http://jsdesignpatterns.com/
 * @constructor
 */
WebZed.Interface = function (name, methods) {
    if (arguments.length !== 2) {
        throw new Error("Interface constructor called with "+arguments.length+
			" arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i += 1) {
        if (typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be "+
				"passed in as a string.");
        }
    }
	this.methods = methods;
};

WebZed.Interface.ensureImplements = function(object) {
	var i, interf, j, method;
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
          arguments.length  + "arguments, but expected at least 2.");
    }

    for (i = 1; i < arguments.length; i += 1) {
        interf = arguments[i];
        if (interf.constructor !== WebZed.Interface) {
            throw new Error("Function Interface.ensureImplements expects "+
				"arguments two and above to be instances of Interface.");
        }

        for (j = 0; j < interf.methods.length; j += 1) {
            method = interf.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new TypeError("Function Interface.ensureImplements: object "+
					"does not implement the " + interf.name+
					" interface. Method " + method + " was not found.");
            }
        }
    }
};
/**
 * Interval class
 * 
 * @param {Function} callback
 * @param {Number} delay
 * @param {Number} elapsed
 * @constructor
 */
WebZed.Interval = function (callback, delay, elapsed) {
	if (!(callback instanceof Function)) {
		throw new TypeError("callback should be a Function");
	}
	if (delay.constructor !== Number) {
		throw new TypeError("delay should be a Number");
	}
	if (elapsed && elapsed.constructor !== Number) {
		throw new TypeError("elapsed should be a Number");
	}
	
	this.callback = callback;
	this.delay = delay;
	
	this.elapsed = elapsed || 0;
	
	this.started = false;
	this.interval = null;
};

WebZed.Interval.prototype = {
	/**
	 * Starts the interval
	 * @return void
	 */
	start : function () {
		this.started = true;
		this.interval = setInterval(WebZed.bind(this, "update"), this.delay);
		return null;
	},
	/**
	 * Stops the interval
	 * @return void
	 */
	stop : function () {
		if (!this.started) {
			throw new Error("Interval not started");
		}
		clearInterval(this.interval);
		this.started = false;
		return null;
	},
	/**
	 * Ran on each interval tick
	 * @param overdue amount of milliseconds off from the desired delay
	 * @return void
	 */
	update : function (overdue) {
		this.elapsed += (this.delay + overdue);
		this.callback(this.elapsed);
	}
};
/**
 * Canvas wrapper class
 * @param {Number} width
 * @param {Number} height
 * @constructor
 */
WebZed.Canvas = function (width, height) {
	this.node = document.createElement("canvas");
	if (!("getContext" in this.node)) {
		throw new Error("Browser doesnt support Canvas.getContext()");
	}
	this.context = this.node.getContext("2d");
	
	this.resize(width, height);
};

WebZed.Canvas.prototype = {
	/**
	 * Resizes the display to the given dimensions
	 * @param {Number} width
	 * @param {Number} height
	 */
	resize : function (width, height) {
		if (width.constructor !== Number) {
			throw new TypeError("Width should be a Number");
		}
		if (height.constructor !== Number) {
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
	fill : function (color) {
		if (!color) {
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
	drawImage : function (node, left, top, width, height, sourceLeft, sourceTop) {
		var px;
		
		
		// Do we try to draw at a position outside of the layer
		if (left < 0) {
			if (left + width < 0) {
				return false;
			}
			px = 0 - left; // Amount we're overdue
			width -= px;// Cut it off the width
			sourceLeft += px;
			left = 0;
		}
		// If the image get drawn completely outside skip it
		else if (left > this.width) {
			return false;
		}
		else if (left + width > this.width) {
			width = this.width - left; // Width is the remaining width
		}
		
		if (top < 0) {
			if (top + height < 0) {
				return false;
			}
			px = (0 - top); // Amount we're overdue
			height -= px;// Cut it off the height
			sourceTop += px;
			top = 0;
		}
		else if (top > this.height) {
			return false;
		}
		else if (top + height > this.height) {
			height = this.height - top;// Height is the remaining width
		}
		
		if (!width || !height) {
			return false;
		}
		
		this.context.drawImage(node, sourceLeft, sourceTop, width, height,
			left, top, width, height);
		return true;
	}
};
/**
 * ObjectPool for the recycling of objects
 *
 * Classes with a short livespan benefit from this, it reuses
 * objects instead of generating new ones each time and having the
 * garbage collector cleaning up all unreferenced old objects
 * @param {Function} objectClass Constructor of the host class
 * @return void
 */
WebZed.ObjectPool = function (objectClass) {
	if (!(objectClass instanceof Function)) {
		throw new TypeError("objectClass should be of type Function");
	}

	this.objectClass = objectClass;
	this.pool = [];
};

/**
 * Returns a objectClass instance either recycling an old one or creating
 * a new one if no old instances are available
 * @param [argN] any args passed to the object constructor
 * @return {Object} Object of type objectClass
 */
WebZed.ObjectPool.prototype.create = function () {
	var obj;
	if (this.pool.length) {
		obj = this.pool.pop();
		this.objectClass.apply(obj, arguments);
	}
	else {
		obj = this.createNew(arguments);
	}
	
	obj.active = true;
	return obj;
};

/**
 * Creates a new objectClass instance
 * @param {Array} args
 * @return {Object} new instance of type objectClass
 */
WebZed.ObjectPool.prototype.createNew = function (args) {
	// there is no way to do a new SomeClass with an array
	// as arguments so we create a function to do just that
	for (var argParams = [], i = 0, len = args.length; i < len; i += 1) {
		argParams.push("a[" + i + "]");
	}
	
	return (new Function("c", "a",
		"return new c(" + argParams.join(",") + ");")(this.objectClass, args));
};

/**
 * Recycle a object putting it in the pool to be used for a next create call
 * @param {Object} obj Object to recycle
 * @param {Bool}strip
 * @return void
 */
WebZed.ObjectPool.prototype.recycle = function (obj, strip) {
	if (!obj.active) {
		throw new Error("Object is already recycled");
	}
	if (strip) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				delete obj[prop];
			}
		}
	}
	obj.active = false;
	this.pool.push(obj);
};

/**
 * Augment the objectClass with a create and recycle method
 * @return void
 */
WebZed.ObjectPool.prototype.augment = function () {
	var pool = this;
	this.objectClass.create = WebZed.bind(this, "create");
	this.objectClass.prototype.recycle = function (strip) {
		pool.recycle(this, strip);
	};
};
/**
 * A array in which all entries should be unique and some extra methods
 * 
 * @constructor
 * @param {Array} items
 */
WebZed.ObjectCollection = function (items) {
	if (items) {
		if (!(items instanceof Array)) {
			throw new TypeError("items should be an array");
		}
		items.forEach(function (item) {
			this.push(item);
		}, this);
	}
};

// extend array
WebZed.ObjectCollection.prototype = [];

/**
 * Pushes a item to the end of the collection
 * @param {Object} item
 * @return {Number} New length of the collection
 */
WebZed.ObjectCollection.prototype.push = function (item) {
	if (this.contains(item)) {
		throw new Error("item is already in collection");
	}
	return Array.prototype.push.call(this, item);
};

/**
 * Unshifts a item to the start of the collection
 * @param {Object} item
 * @return {Number} New length of the collection
 */
WebZed.ObjectCollection.prototype.unshift = function (item) {
	if (this.contains(item)) {
		throw new Error("item is already in collection");
	}
	return Array.prototype.unshift.call(this, item);
};

/**
 * Add a item to the stack at the given position
 * @param {Number} position
 * @param {Object} item
 */
WebZed.ObjectCollection.prototype.addAt = function (position, item) {
	if (position.constructor !== Number) {
		throw new TypeError("position should be a Number");
	}
	if (this.contains(item)) {
		throw new Error("Item is already in collection");
	}
	
	this.splice(position, 0, item);
};

/**
 * Add a Item before a given other item in the stack
 * @param {Object} before
 * @param {Object} item
 */
WebZed.ObjectCollection.prototype.addBefore = function (before, item) {
	before = this.indexOf(before);
	if (before === -1) {
		throw new Error("Item to add before not found");
	}
	this.addAt(before, item);
};

/**
 * Add a Item after a given other item in the stack
 * @param {Object} after
 * @param {Object} item
 */
WebZed.ObjectCollection.prototype.addAfter = function (after, item) {
	after = this.indexOf(after);
	if (after === -1) {
		throw new Error("Item to add after not found");
	}
	this.addAt(after + 1, item);
};

/**
 * Removes a item from the stack
 * @param {Object} item
 */
WebZed.ObjectCollection.prototype.remove = function (item) {
	var i = this.indexOf(item);
	if (i === -1) {
		throw new Error("Item not found");
	}
	this.splice(i, 1);
};

/**
 * Tells if the collection contains the item
 * @param {Object} item
 * @return bool
 */
WebZed.ObjectCollection.prototype.contains = function (item) {
	return this.indexOf(item) !== -1;
};
/**
 * A Display implemented with Canvas
 * @constructor
 * @type DisplayInterface
 * @param {Number} width
 * @param {Number} height
 * @param {String} bgcolor
 * @param {Canvas} canvas
 */
WebZed.CanvasDisplay = function (width, height, bgcolor, canvas) {
	this.width = width;
	this.height = height;
	this.canvas = canvas || new WebZed.Canvas(width, height);
	this.bgcolor = bgcolor;
};

WebZed.CanvasDisplay.prototype = {
	/**
	 * Called before a paint run
	 */
	paintStart : function () {
		this.canvas.fill(this.bgcolor);
	},
	/**
	 * Called after a paint run
	 */
	paintEnd : function () {
		// if we're using a back buffer we can copy it to the output here
	},
	paintImage : function (node, left, top, width, height, sourceLeft, sourceTop) {
		return this.canvas.drawImage(node, left, top, width, height, sourceLeft, sourceTop);
	}
};
WebZed.DisplayInterface = new WebZed.Interface("DisplayInterface", [
	"paintStart", /**/
	"paintEnd", /**/
	"paintImage" /* node, left, top, width, height, source_left, source_top */
]);
WebZed.Map = function (width, height, tileWidth, tileHeight, tiles, tilesets) {
	var i, count = 0;
	
	if (width * height !== tiles.length) {
		throw new Error("Not enough tiles to fill the map with");
	}
		
	for (i = 0; i < tilesets.length; i += 1) {
		count += (tilesets[i].width / tileWidth) *
			(tilesets[i].height / tileHeight);
	}
	
	for (i = 0; i < tiles.length; i += 1) {
		if (tiles[i] > count) {
			throw new Error("Tileset missing for tile with gid " + tiles[i]);
		}
	}
	
	this.width = width;
	this.height = height;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	
	this.tiles = tiles;
	this.tilesets = tilesets;
};

WebZed.Map.prototype = {
	paintTile: function (left, top, display, leftOffset, topOffset) {
		var gid = this.tiles[(top * this.width) + left],
		srcNode, srcLeft, srcTop, t, tileset, tilesetWidth, count;
		if (!gid) {
			return;
		}
		
		for (t = 0; t < this.tilesets.length; t += 1) {
			tileset = this.tilesets[t];
			tilesetWidth = (tileset.width / this.tileWidth);
			count = (tilesetWidth * (tileset.height / this.tileHeight));
			if (gid > count) {
				gid -= count;
				srcNode = false;
			}
			else {
				srcNode = tileset;
				srcLeft = (gid % tilesetWidth) * this.tileWidth;
				srcTop = Math.floor(gid / tilesetWidth) * this.tileHeight;
			}
		}
		
		if (!srcNode) {
			throw new Error("no tileset found for gid " + gid);
		}
		display.paintImage(srcNode, leftOffset, topOffset,
			this.tileWidth, this.tileHeight, srcLeft, srcTop);
	}
};
WebZed.MapViewFull = function (map, display) {
	
	if (map.width * map.tileWidth !== display.width) {
		throw new Error("display width should correspond with map width");
	}
	if (map.height * map.tileHeight !== display.height) {
		throw new Error("display height should correspond with map height");
	}
	
	this.map = map;
	this.display = display;
};

WebZed.MapViewFull.prototype = {
	/**
	 * Paint tiles on the canvas 
	 */
	paintMap : function () {
		var y, x;
	
		this.display.paintStart();
		for (y = 0; y < this.map.height; y += 1) {
			for (x = 0; x < this.map.width; x += 1) {
				this.map.paintTile(
					x, y, this.display,
					x * this.map.tileWidth,
					y * this.map.tileHeight);
			}
		}
		this.display.paintEnd();
	}	
};
/**
 * ImageSource class
 * 
 * @constructor
 * @param node The DOMnode being used
 * @param width width of a frame on the node
 * @param height height of a frame on the node
 */
WebZed.ImageSource = function (node, width, height) {
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
};

WebZed.ImageSource.vertical = "vertical";
WebZed.ImageSource.horizontal = "horizontal";
/**
 * A array in which all entries should be unique and some extra methods
 * 
 * @constructor
 * @implements PaintableInterface
 * @param {Array} paintables
 */
WebZed.PaintableCollection = function (paintables) {
	if (paintables) {
		if (!(paintables instanceof Array)) {
			throw new TypeError("paintables should be an array");
		}
		paintables.forEach(function (item) {
			this.push(item);
		}, this);
	}
};

// extend ObjectCollection
WebZed.PaintableCollection.prototype = new WebZed.ObjectCollection();

/**
 * Overwrite the default push and check if new item implements PaintableInterface
 */
WebZed.PaintableCollection.prototype.push = function (item) {
	WebZed.Interface.ensureImplements(item, WebZed.PaintableInterface);
	return WebZed.ObjectCollection.prototype.push.call(this, item);
};

/**
 * Overwrite the default unshift to check if an item implements PaintableInterface
 */
WebZed.PaintableCollection.prototype.unshift = function (item) {
	WebZed.Interface.ensureImplements(item, WebZed.PaintableInterface);
	return WebZed.ObjectCollection.prototype.unshift.call(this, item);
};

/**
 * Overwrite the addAt method to check if the item implements PaintableInterface
 */
WebZed.PaintableCollection.prototype.addAt = function (position, item) {
	WebZed.Interface.ensureImplements(item, WebZed.PaintableInterface);
	return WebZed.ObjectCollection.prototype.addAt.call(this, position, item);
};

/**
 * Runs the paint method on all paintables with the given arguments
 */
WebZed.PaintableCollection.prototype.paint = function () {
	for (var i = 0, len = this.length; i < len; i += 1) {
		this[i].paint.apply(this[i], arguments);
	}
};
WebZed.PaintableInterface = new WebZed.Interface("PaintableInterface", [
	"paint" /* display, time, left, top */
]);
/**
 * The Painter paints a paintable at a display with a given frequency
 * 
 * @param {PaintableInterface} paintable The paintable(s) that should be painted
 * @param {DisplayInterface} display The display at which the paintable(s) should be painted
 * @param {Number} frequency Time between paints in milliseconds
 * @constructor
 */
WebZed.Painter = function (paintable, display, frequency) {
	WebZed.Interface.ensureImplements(paintable, WebZed.PaintableInterface);
	WebZed.Interface.ensureImplements(display, WebZed.DisplayInterface);
	if (frequency.constructor !== Number) {
		throw new TypeError("frequency should be a number");
	}
	
	this.paintable = paintable;
	this.display = display;
	this.interval = new WebZed.Interval(WebZed.bind(this, "update"), frequency);
};

/**
 * Starts the painting loop
 * @return void
 */
WebZed.Painter.prototype.start = function () {
	this.update(this.interval.elapsed);
	this.interval.start();
};

/**
 * Stops the painting loop
 * @return int Returns the time at which the loop stopped
 */
WebZed.Painter.prototype.stop = function () {
	if (!this.interval.started) {
		throw new Error("Paint loop hasn't started");
	}
	this.interval.stop();
	return this.interval.elapsed;
};

/**
 * Updates the display with the paintable
 * @param {Number} elapsed time elapsed
 */
WebZed.Painter.prototype.update = function (elapsed) {
	this.display.paintStart();
	this.paintable.paint(this.display, elapsed);
	this.display.paintEnd();
};
/**
 * 
 * @constructor
 * @implements PaintableInterface
 * @param {ImageSource} image
 * @param {Number} left
 * @param {Number} top
 * @param {Array} behaviors
 * @param {Function} onpaint
 * @param {PaintableCollection} children
 */
WebZed.Sprite = function (image, left, top, behaviors, onpaint, children) {
	if(!image || !(image instanceof WebZed.ImageSource)) {
		throw new TypeError("image should be a ImageSource object");
	}
	if(left.constructor !== Number) {
		throw new TypeError("left should be a Number");
	}
	if(top.constructor !== Number) {
		throw new TypeError("top should be a Number");
	}
	
	if(behaviors && !(behaviors instanceof WebZed.ObjectCollection)) {
		throw new TypeError("behaviors should be a ObjectCollection");
	}
	
	if(onpaint && !(onpaint instanceof Function)) {
		throw new TypeError("onpaint should be a Function");
	}
	if(children && !(children instanceof WebZed.PaintableCollection)) {
		throw new TypeError("children should be a PaintableCollection");
	}
	
	this.image = image;
	this.left = left;
	this.top = top;
	this.onpaint = onpaint;
	this.children = children || new WebZed.PaintableCollection();
	this.behaviors = behaviors || new WebZed.ObjectCollection();
	
	this.source_left = 0;
	this.source_top = 0;
};

WebZed.Sprite.prototype = {
	/**
	 * Paint the ImageSource on a display
	 * @param display
	 * @param time Amount of time in milliseconds that have passed
	 * @param left Offset from the left on the display
	 * @param top Offset from the top on the display
	 */
	paint : function(display, time, left, top) {
		for(var i = 0, len = this.behaviors.length; i < len; i += 1) {
			this.behaviors[i].updateSprite(this, display, time);
		}
		
		if(this.onpaint) {
			if(false === this.onpaint(display, time, left, top)) {
				return;
			}
		}
		
		left = this.left + (left || 0);
		top = this.top + (top || 0);
	
		display.paintImage(this.image.node, left, top,
				this.image.width, this.image.height,
				this.source_left, this.source_top);
		
		this.children.paint(display, time, left, top);
	},
	/**
	 * Checks if the sprite is within the viewport of a Display
	 * @param display the display to check against
	 * @return bool
	 */
	inViewport : function(display) {
		return this.top < display.height &&
			this.left < display.width &&
			this.top + this.image.height > 0 &&
			this.left + this.image.width > 0;
	},
	/**
	 * Checks if we collide with other sprites
	 * WARNING this does not take parent offsets into account like painting does
	 * so only use this with sprites which are in the same PaintableCollection
	 * 
	 * @param sprites array with sprites to test against
	 * @return array with sprites that collided
	 */
	collidesWith : function(sprites) {
		var result = [], i, sprite,
		bottom = this.top + this.image.height,
		right = this.left + this.image.width;
			
		for(i = sprites.length - 1; i >= 0; i -= 1) {
			sprite = sprites[i];
			if(sprite === this) {
				continue;
			}
			
			// we're to far to the top to touch
			if(sprite.top + sprite.image.height < this.top ||
			// we're to far to the right to touch
			sprite.left + sprite.image.width < this.left ||
			// we're to far to the bottom to touch
			sprite.top > bottom ||
			// we're to far to the left to touch
			sprite.left > right) {
				continue;
			}
			result.push(sprite);
		}
				
		return result;
	}
};
/**
 * Animated Sprite Behavior
 *
 * @constructor
 * @param {Number} direction direction of the animation
 * @param {Number} speed amount of time between frames
 * @param {Function} once If this is set the animation is just run once 
 * @implements SpriteBehaviorInterface
 */
WebZed.SpriteBehaviorAnimate = function (direction, speed, once) {
	if(direction !== WebZed.SpriteBehaviorAnimate.vertical &&
	direction !== WebZed.SpriteBehaviorAnimate.horizontal) {
		throw new TypeError("Direction should either be vertical or horizontal");
	}
	if(speed.constructor !== Number) {
		throw new TypeError("Speed should be a number");
	}
	if(once && true !== once && !(once instanceof Function)) {
		throw new TypeError("Once should be a callback function or boolean true");
	}
	
	this.direction = direction;
	this.speed = speed;
	this.once = once || false;
	this.start_time = false;
};

WebZed.SpriteBehaviorAnimate.vertical = 1;
WebZed.SpriteBehaviorAnimate.horizontal = 2;

WebZed.SpriteBehaviorAnimate.prototype = {
	/**
	 * Method that will run before a sprite paints itself on a display
	 * 
	 * @param {Sprite} sprite the sprite that is about to write
	 * @param {DisplayInterface} display the display the spite has to write to
	 * @param {Number} time amount of milliseconds
	 */
	updateSprite : function(sprite, display, time) {
		// The animation should start from the first call
		if(false === this.start_time) {
			this.start_time = time;
		}
		time = time - this.start_time;
		
		if(false !== this.once) {
			var frames;
			if(this.direction === WebZed.SpriteBehaviorAnimate.horizontal) {
				frames = sprite.image.horizontalFrames;
			}
			else {
				frames = sprite.image.verticalFrames;
			}
			
			if(time >= this.speed * frames) {
				if(true !== this.once) {
					this.once(sprite, display, time);
				}
				sprite.behaviors.remove(this);
			}
		}
	
		if(this.direction === WebZed.SpriteBehaviorAnimate.horizontal) {
			sprite.source_left = sprite.image.width * 
				(Math.floor(time / this.speed) % sprite.image.horizontalFrames); 
		}
		else {
			sprite.source_top = sprite.image.height *
				(Math.floor(time / this.speed) % sprite.image.verticalFrames); 
		}
	}	
};
/**
 * Sprite Frame Behavior shows a certain frame
 * 
 * @constructor
 * @param direction
 * @param frame
 * @implements SpriteBehaviorInterface
 */
WebZed.SpriteBehaviorFrame = function (direction, frame) {
	if(direction !== WebZed.SpriteBehaviorFrame.vertical &&
	direction !== WebZed.SpriteBehaviorFrame.horizontal) {
		throw new TypeError("Direction should either be vertical or horizontal");
	}
	this.direction = direction;
	this.frame = frame || 0;
};

WebZed.SpriteBehaviorFrame.vertical = 1;
WebZed.SpriteBehaviorFrame.horizontal = 2;

WebZed.SpriteBehaviorFrame.prototype = {
	updateSprite : function(sprite, display, time) {
		if(this.direction === WebZed.SpriteBehaviorFrame.horizontal) {
			sprite.source_left = (this.frame % sprite.image.horizontalFrames) *
			sprite.image.width; 
		}
		else {
			sprite.source_top = (this.frame % sprite.image.verticalFrames) *
			sprite.image.height; 
		}
	}
};
WebZed.SpriteBehaviorInterface = new WebZed.Interface("SpriteBehaviorInterface", [
	"updateSprite"
]);

return WebZed;
}());