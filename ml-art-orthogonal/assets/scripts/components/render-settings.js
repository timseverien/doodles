import Base from './base.js';
import MathUtils from '../utils/math.js';

export default class RenderSettings extends Base {
	constructor(element) {
		super(element);

		this.inputSeed = this.getElement('input-seed');
		this.inputTime = this.getElement('input-time');
		this.inputVariance = this.getElement('input-variance');

		this.inputSeed.max = Number.MAX_SAFE_INTEGER;

		this.randomize();
	}

	randomize() {
		this.inputSeed.value = Math.round(MathUtils.lerp(
			Number.parseInt(this.inputSeed.min),
			Number.parseInt(this.inputSeed.max),
			Math.random()));

		this.inputTime.value = Math.round(MathUtils.lerp(-8, 8, Math.random()));

		this.inputVariance.value = Math.round(MathUtils.lerp(
			Number.parseInt(this.inputVariance.min),
			Number.parseInt(this.inputVariance.max),
			Math.random()));
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
