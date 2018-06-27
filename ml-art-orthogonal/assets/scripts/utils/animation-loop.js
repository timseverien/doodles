import noop from './noop.js';

export default class AnimationLoop {
	constructor(callback) {
		if (typeof callback !== 'function') {
			throw new Error(`Callback ${callback} should be a function`);
		}

		this._callback = callback;
		this._isStopped = false;
		this._onStopCallback = null;
		this._rId = null;
		this._timePrevious = 0;
		this.frame = 0;
		this.frameRate = 1;
	}

	start() {
		const now = performance.now();

		this.frame = 0;
		this._isStopped = false;
		this._timePrevious = now;

		this._next(now);
	}

	stop(callback = noop) {
		if (this._isStopped) {
			callback();
			return;
		}

		this._isStopped = true;
		cancelAnimationFrame(this._rid);

		if (typeof callback === 'function') {
			requestAnimationFrame(callback);
		}
	}

	_next(time) {
		if (this._isStopped) return;

		const delta = (time - this._timePrevious) / 1000;

		this._timePrevious = time;
		this.frameRate = 1 / delta;

		requestAnimationFrame(this._next.bind(this));
		this._callback(this.frame++, time);
	}
}
