/**
 * The Painter paints a paintable at a display with a given frequency
 * 
 * @param paintable The paintable(s) that should be painted
 * @param display The display at which the paintable(s) should be painted
 * @constructor
 */
function Painter(paintable, display) {
	Interface.ensureImplements(paintable, PaintableInterface);
	Interface.ensureImplements(display, DisplayInterface);
	
	this._paintable = paintable;
	this._display = display;
		
	this._time = null;
	this._interval = null;
	this._paused = null;
};

/**
 * Starts the painting loop
 * @param frequency Time between paints in milliseconds
 * @param time Time offset in milliseconds to start from (when paused for ex)
 */
Painter.prototype.start = function(frequency, time) {
	if(frequency.constructor !== Number) {
		throw new TypeError("frequency should be of type Number");
	}
	
	if(this._interval) {
		throw new Error("Paint loop has already started");
	}
	
	this._time = time || 0;
	
	var self = this;
	this._interval = setInterval(function(late){
		self._time += (frequency + late);
		self._display.paintStart();
		self._paintable.paint(self._display, self._time);
		self._display.paintEnd();
	}, frequency);
	
	this._paintable.paint(this._display, this._time);
};

/**
 * Stops the painting loop
 * @return int Returns the time at which the loop stopped
 */
Painter.prototype.stop = function() {
	if(!this._interval) {
		throw new Error("Paint loop hasn't started");
	}
	clearInterval(this._interval);
	var time = this._time;
	this._time = 0;
	return time;
};

