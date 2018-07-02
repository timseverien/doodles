import Base from './base.js';
import MathUtils from '../utils/math.js';

export default class FormRendering extends Base {
	constructor(element) {
		super(element);

		this.inputSeed = this.element.elements['seed'];
		this.inputTime = this.element.elements['time'];
		this.inputVariance = this.element.elements['variance'];

		this.element.addEventListener('input', () => this.trigger('change'));
		this.inputSeed.addEventListener('input', () => this.trigger('change'));
		this.inputSeed.max = Number.MAX_SAFE_INTEGER;

		this.element.addEventListener('click', (e) => {
			if (e.target.name !== 'randomize') return;
			this.randomize();
		});

		this.randomize();
	}

	randomize() {
		this.inputSeed.value = Math.round(MathUtils.lerp(
			Number.parseInt(this.inputSeed.min),
			Number.parseInt(this.inputSeed.max),
			Math.random()));

		this.inputTime.value = MathUtils.lerp(-2, 2, Math.random()).toFixed(3);

		this.inputVariance.value = Math.round(MathUtils.lerp(
			Number.parseInt(this.inputVariance.min),
			Number.parseInt(this.inputVariance.max),
			Math.random()));

		this.trigger('change');
	}

	get seed() {
		return Number.parseInt(this.inputSeed.value);
	}

	set seed(value) {
		this.inputSeed.value = value;
		this.trigger('change');
	}

	get time() {
		return Number.parseFloat(this.inputTime.value);
	}

	set time(value) {
		this.inputTime.value = value;
		this.trigger('change');
	}

	get variance() {
		return Number.parseInt(this.inputVariance.value);
	}

	set variance(value) {
		this.inputVariance.value = value;
		this.trigger('change');
	}
}
