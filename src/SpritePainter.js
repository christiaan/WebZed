/**
 * SpritePainter class
 * @param sprites The sprite collection that should be painted
 * @param display The display at which the sprites should paint
 * @constructor
 */
function SpritePainter(sprites, display) {
	if(!(sprites instanceof SpriteCollection)) {
		throw new TypeError("Sprites should be a valid SpriteCollection");
	}
	Interface.ensureImplements(display, DisplayInterface);
	
	this._sprites = sprites;
	this._display = display;
		
	this._time = null;
	this._interval = null;
	this._paused = null;
};

/**
 * Starts the painting loop at the configured interval
 * @param frequency Time between paints in milliseconds
 * @param time Time offset in milliseconds to start from
 */
SpritePainter.prototype.start = function(frequency, time) {
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
		self._sprites.paint(self._display, self._time);
		self._display.paintEnd();
	}, frequency);
	
	this._sprites.paint(this._display, this._time);
};

/**
 * Stops the painting loop
 * @return int Returns the time at which the loop stopped
 */
SpritePainter.prototype.stop = function() {
	if(this._tick === 0) {
		throw new Error("Paint loop hasn't started");
	}
	if(this._interval) {
		clearInterval(this._interval);
	}
	var time = this._time;
	this._time = 0;
	return time;
};

