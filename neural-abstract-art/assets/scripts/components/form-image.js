import BaseComponent from './base.js';

export default class FormImageComponent extends BaseComponent {
	constructor(element) {
		super(element);

		this.inputHeight = this.element.elements['height'];
		this.inputWidth = this.element.elements['width'];

		this.element.addEventListener('click', (e) => {
			if (e.target.name !== 'resolution') return;

			[
				this.inputWidth.value,
				this.inputHeight.value,
			] = e.target.dataset.resolution.split('x');

			this.trigger('change');
		});

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			this.trigger('change');
		});
	}

	get aspect() {
		return this.width / this.height;
	}

	get height() {
		return Number.parseInt(this.inputHeight.value);
	}

	set height(value) {
		this.inputHeight.value = value;
	}

	get width() {
		return Number.parseInt(this.inputWidth.value);
	}

	set width(value) {
		this.inputWidth.value = value;
	}
}
