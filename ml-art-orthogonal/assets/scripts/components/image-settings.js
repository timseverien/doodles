import Base from './base.js';

export default class ImageSettings extends Base {
	constructor(element) {
		super(element);

		this.inputHeight = this.getElement('input-height');
		this.inputWidth = this.getElement('input-width');
		this.inputUpdatesPerFrame = this.getElement('input-updates-per-frame');
	}

	get height() {
		return Number.parseInt(this.inputHeight.value);
	}

	set height(value) {
		this.inputHeight.value = value;
	}

	get updatesPerFrame() {
		return Number.parseInt(this.inputUpdatesPerFrame.value);
	}

	get width() {
		return Number.parseInt(this.inputWidth.value);
	}

	set width(value) {
		this.inputWidth.value = value;
	}
}
