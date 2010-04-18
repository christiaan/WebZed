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
