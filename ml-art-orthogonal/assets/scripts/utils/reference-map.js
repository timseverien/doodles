const SELECTOR_ATTRIBUTE = '[data-ref]';

export default class ReferenceMap {
	constructor(context = document.body) {
		this._references = ReferenceMap.getReferences(context);
	}

	get(reference) {
		if (!this.has(reference)) {
			return null;
		}

		return this._references.get(reference);
	}

	getAll() {
		return Array.from(this._references.values());
	}

	has(reference) {
		return this._references.has(reference);
	}

	static getReferences(context) {
		const elements = context.querySelectorAll(SELECTOR_ATTRIBUTE);

		return Array.from(elements).reduce((map, element) => {
			map.set(element.dataset.ref, element);

			return map;
		}, new Map)
	}
}
