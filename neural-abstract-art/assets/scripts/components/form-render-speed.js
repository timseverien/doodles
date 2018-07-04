import BaseComponent from './base.js';

const batchSizes = [
	128,
	512,
	1024,
	2048,
];

export default class FormRenderSpeedComponent extends BaseComponent {
	constructor(element) {
		super(element);

		this.element.addEventListener('change', () => this.trigger('change'));
	}

	get batchSize() {
		const index = Number.parseInt(this.element.elements['render-speed'].value);

		return batchSizes[index];
	}
}
