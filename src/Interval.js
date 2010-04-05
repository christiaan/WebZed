/**
 * Interval class
 * 
 * @param {Function} callback
 * @param {Number} delay
 * @param {Number} elapsed
 * @constructor
 */
function Interval(callback, delay, elapsed) {
	if(!(callback instanceof Function)) {
		throw new TypeError("callback should be a Function");
	}
	if(delay.constructor !== Number) {
		throw new TypeError("delay should be a Number");
	}
	if(elapsed && elapsed.constructor !== Number) {
		throw new TypeError("elapsed should be a Number");
	}
	
	this.callback = callback;
	this.delay = delay;
	
	this.elapsed = elapsed || 0;
	
	this.started = false;
	this._interval = null;
};

Interval.prototype = {
	/**
	 * Starts the interval
	 * @return void
	 */
	start : function() {
		this.started = true;
		this._interval = setInterval(bind(this, "update"), this.delay);
		return null;
	},
	/**
	 * Stops the interval
	 * @return void
	 */
	stop : function() {
		if(!this.started) {
			throw new Exception("Interval not started");
		}
		clearInterval(this._interval);
		this.started = false;
		return null;
	},
	/**
	 * Ran on each interval tick
	 * @param overdue amount of milliseconds off from the desired delay
	 * @return void
	 */
	update : function(overdue) {
		this.elapsed += (this.delay + overdue);
		this.callback(this.elapsed);
	}
};