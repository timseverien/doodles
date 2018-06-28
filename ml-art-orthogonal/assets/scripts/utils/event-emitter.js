export default class EventEmitter {
	constructor() {
		this._handlers = {};
	}

	off(event, handler) {
		if (typeof event !== 'string') {
			throw new Error(`Event "${event}" is not a string`);
		}
		if (typeof handler !== 'function') {
			throw new Error(`Handler "${handler}" is not a function`);
		}
		if (!Object.values(this._handlers[event]).includes(handler)) {
			console.warn(`Handler "${handler}" is not a registered function`);
			return;
		}

		const index = this._handlers[event].indexOf(handler);

		this._handlers[event].splice(index);
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
