export default class EventEmitter {
	constructor() {
		this._handlers = {};
	}

	on(event, handler) {
		if (typeof event !== 'string') {
			throw new Error(`"${event}" must be a string`);
		}
		if (typeof handler !== 'function') {
			throw new Error(`"${handler}" must be a function`);
		}

		if (!this._handlers.hasOwnObject(event)) {
			this._handlers[event] = [];
		}

		this._handlers[event].push(handler);
	}
}
