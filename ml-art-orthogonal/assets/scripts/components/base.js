import EventEmitter from '../utils/event-emitter.js';

export default class Base extends EventEmitter {
	constructor(element) {
		super();

		this.element = element;
	}

	dispose() {
		// Override
	}

	getComponentElement(name) {
		return this.element.querySelector(`[data-component="${name}"]`);
	}

	getElement(name) {
		return this.element.querySelector(`[data-ref="${name}"]`);
	}

	getElements(name) {
		return Array.from(this.element.querySelectorAll(`[data-ref="${name}"]`));
	}
}
