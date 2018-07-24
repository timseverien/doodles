export default class FpsMeter {
	constructor() {
		this.fps = 0;
		this._lastFpsUpdate = 0;
		this._lastUpdate = 0;
	}

	update() {
		const now = performance.now() / 1000;

		this.fps = Math.floor(1 / (now - this._lastUpdate)).toString().padStart(4, '0');
		this._lastFpsUpdate = now;
		this._lastUpdate = now;
	}
}
