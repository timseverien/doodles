export default class EventEmitter {
	constructor() {
		this._handlers = {};
	}

	on(event, handler) {
		if (typeof event !== 'string') {
			throw new Error(`Event "${event}" is not a string`);
		}
		if (typeof handler !== 'function') {
			throw new Error(`Handler "${handler}" is not a function`);
		}

		if (!(event in this._handlers)) {
			this._handlers[event] = [];
		}

		this._handlers[event].push(handler);
	}

	trigger(event, ...args) {
		if (!(event in this._handlers)) {
			return;
		}

		this._handlers[event].forEach(fn => fn(...args));
	}
}
