/**
 * The Painter paints a paintable at a display with a given frequency
 * 
 * @param {PaintableInterface} paintable The paintable(s) that should be painted
 * @param {DisplayInterface} display The display at which the paintable(s) should be painted
 * @param {Number} frequency Time between paints in milliseconds
 * @constructor
 */
function Painter(paintable, display, frequency) {
	Interface.ensureImplements(paintable, PaintableInterface);
	Interface.ensureImplements(display, DisplayInterface);
	if(frequency.constructor !== Number) {
		throw new TypeError("frequency should be a number");
	}
	
	this.paintable = paintable;
	this.display = display;
	this.interval = new Interval(bind(this, "update"), frequency);
};

/**
 * Starts the painting loop
 * @return void
 */
Painter.prototype.start = function() {
	this.update(this.interval.elapsed);
	this.interval.start();
};

/**
 * Stops the painting loop
 * @return int Returns the time at which the loop stopped
 */
Painter.prototype.stop = function() {
	if(!this.interval.started) {
		throw new Error("Paint loop hasn't started");
	}
	this.interval.stop();
	return this.interval.elapsed;
};

/**
 * Updates the display with the paintable
 * @param {Number} elapsed time elapsed
 */
Painter.prototype.update = function(elapsed) {
	this.display.paintStart();
	this.paintable.paint(this.display, elapsed);
	this.display.paintEnd();
};
