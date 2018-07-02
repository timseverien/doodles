import Base from './base.js';

export default class ImageSettings extends Base {
	constructor(element) {
		super(element);

		const buttonsBatchSize = this.getElements('button-batch-size');
		const buttonsResolution = this.getElements('button-resolution');

		this.inputBatchSize = this.getElement('input-batch-size');
		this.inputHeight = this.getElement('input-height');
		this.inputWidth = this.getElement('input-width');

		this.inputBatchSize.addEventListener('input', () => this.trigger('change'));
		this.inputHeight.addEventListener('input', () => this.trigger('change'));
		this.inputWidth.addEventListener('input', () => this.trigger('change'));

		this.element.addEventListener('click', (e) => {
			if (buttonsBatchSize.includes(e.target)) {
				this.inputBatchSize.value = Number.parseInt(e.target.dataset.batchSize);
				this.trigger('change:preset');
			}

			if (buttonsResolution.includes(e.target)) {
				[
					this.inputWidth.value,
					this.inputHeight.value,
				] = e.target.dataset.resolution.split('x');

				this.trigger('change:preset');
			}
		});
	}

	get batchSize() {
		return Number.parseInt(this.inputBatchSize.value);
	}

	get height() {
		return Number.parseInt(this.inputHeight.value);
	}

	set height(value) {
		this.inputHeight.value = value;
		this.trigger('change');
	}

	get width() {
		return Number.parseInt(this.inputWidth.value);
	}

	set width(value) {
		this.inputWidth.value = value;
		this.trigger('change');
	}
}
