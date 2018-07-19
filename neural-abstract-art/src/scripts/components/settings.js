import DeviceSettingsModel from '../models/device-settings.js';
import ImageSettingsModel from '../models/image-settings.js';
import RenderSettingsModel from '../models/render-settings.js';
import RenderSettingsRepository from '../repositories/render-settings.js';
import debounce from '../utils/debounce.js';

import BaseComponent from './base.js';

const batchSizes = [
	128,
	512,
	1024,
	2048,
];

export default class SettingsComponent extends BaseComponent {
	constructor(element) {
		super(element);

		// Image settings
		this._inputHeight = this.element.elements.height;
		this._inputHeight.min = 1;
		this._inputWidth = this.element.elements.width;
		this._inputWidth.min = 1;

		// Render settings
		this._inputSeed = this.element.elements.seed;
		this._inputSeed.max = RenderSettingsModel.SEED_MAX;
		this._inputSeed.min = RenderSettingsModel.SEED_MIN;
		this._inputSeed.step = 1;
		this._inputTime = this.element.elements.time;
		this._inputTime.step = 1 / Math.pow(10, RenderSettingsModel.TIME_PRECISION);
		this._inputSharpness = this.element.elements.sharpness;
		this._inputSharpness.max = RenderSettingsModel.SHARPNESS_MAX;
		this._inputSharpness.min = RenderSettingsModel.SHARPNESS_MIN;
		this._buttonRandomize = this.element.elements.randomize;

		// Device settings
		this._inputDeviceStrength = this.element.elements['device-strength'];
		this._inputDeviceStrength.min = 0;
		this._inputDeviceStrength.max = batchSizes.length - 1;
		this._inputDeviceStrength.step = 1;

		this._deviceSettings = new DeviceSettingsModel();
		this._imageSettings = new ImageSettingsModel();
		this._renderSettings = new RenderSettingsModel();

		this._updateFields();

		const handleInputUpdate = debounce(this._handleInputUpdate.bind(this));

		this.element.addEventListener('input', (e) => {
			if (
				e.target !== this._inputDeviceStrength &&
				e.target !== this._inputSeed &&
				e.target !== this._inputTime &&
				e.target !== this._inputSharpness
			) return;

			handleInputUpdate();
		});

		this.element.addEventListener('change', (e) => {
			if (
				e.target !== this._inputWidth &&
				e.target !== this._inputHeight
			) return;

			handleInputUpdate();
		});

		this.element.addEventListener('click', (e) => {
			if (e.target.name !== 'resolution-preset') return;

			this._imageSettings.setResolutionFromString(e.target.dataset.resolution);
			this.trigger('change');
		});

		this._buttonRandomize.addEventListener('click', () => this._randomize());
	}

	get aspect() {
		return this.width / this.height;
	}

	get batchSize() {
		if (!batchSizes[this._deviceSettings.deviceStrength]) {
			return batchSizes[0];
		}

		return batchSizes[this._deviceSettings.deviceStrength];
	}

	get height() {
		return this._imageSettings.height;
	}

	get pixelCount() {
		return this.height * this.width;
	}

	get seed() {
		return this._renderSettings.seed;
	}

	get time() {
		return this._renderSettings.time;
	}

	get sharpness() {
		return this._renderSettings.sharpness;
	}

	get width() {
		return this._imageSettings.width;
	}

	update() {
		const renderSettings = RenderSettingsRepository.getRenderSettings();

		if (renderSettings) {
			this._renderSettings = RenderSettingsRepository.getRenderSettings();
		}

		this._updateFields();
	}

	persist() {
		RenderSettingsRepository.persist(this._renderSettings);
	}

	_handleInputUpdate() {
		if (!this.element.reportValidity()) return;

		this._hydrate();
		this.persist();
		this.trigger('change');
	}

	_hydrate() {
		this._renderSettings.seed = Number.parseInt(this._inputSeed.value);
		this._renderSettings.time = Number.parseFloat(this._inputTime.value);
		this._renderSettings.sharpness = Number.parseInt(this._inputSharpness.value);

		this._imageSettings.height = Number.parseInt(this._inputHeight.value);
		this._imageSettings.width = Number.parseInt(this._inputWidth.value);

		this._deviceSettings.deviceStrength = Number.parseInt(this._inputDeviceStrength.value);
	}

	_randomize() {
		this._renderSettings.randomize();
		this.persist();

		this.trigger('change');
	}

	_updateFields() {
		this._inputSeed.value = this._renderSettings.seed;
		this._inputTime.value = this._renderSettings.time;
		this._inputSharpness.value = this._renderSettings.sharpness;

		this._inputHeight.value = this._imageSettings.height;
		this._inputWidth.value = this._imageSettings.width;

		this._inputDeviceStrength.value = this._deviceSettings.deviceStrength;
	}
}
