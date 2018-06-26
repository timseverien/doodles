import Base from './base.js';

export default class RenderSettings extends Base {
	constructor(element) {
		super(element);

		this.inputSeed = this.getElement('input-seed');
		this.inputTime = this.getElement('input-time');
		this.inputVariance = this.getElement('input-variance');
	}

	get seed() {
		return Number.parseInt(this.inputSeed.value);
	}

	get time() {
		return Number.parseFloat(this.inputTime.value);
	}

	get variance() {
		return Number.parseInt(this.inputVariance.value);
	}
}
