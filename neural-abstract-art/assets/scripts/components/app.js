import debounce from '../utils/debounce.js';

import BaseComponent from './base.js';
import SettingsComponent from './settings.js';

import FormImageComponent from './form-image.js';
import FormRenderSpeedComponent from './form-render-speed.js';
import FormRenderingComponent from './form-rendering.js';
import ImageRendererComponent from './image-renderer.js';
import ImageRendererReportComponent from './image-renderer-report.js';

export default class App extends BaseComponent {
	constructor(element) {
		super(element);

		this.settings = new SettingsComponent(this.getComponentElement('settings'));

		// this.formImage = new FormImage(this.getComponentElement('form-image'));
		// this.formRendering = new FormRendering(this.getComponentElement('form-rendering'));
		// this.formRenderSpeed = new FormRenderSpeed(this.getComponentElement('form-render-speed'));
		// this.isInitialized = false;

		// this.imageRenderer = new ImageRenderer(
		// 	this.getComponentElement('image-renderer'),
		// 	this.formImage,
		// 	this.formRendering,
		// 	this.formRenderSpeed);

		// this.imageRendererReport = new ImageRendererReport(
		// 	this.getComponentElement('image-renderer-report'),
		// 	this.imageRenderer);

		// this.formImage.on('change', () => this.restart());
		// this.formRenderSpeed.on('change', () => this.restart());
		// this.imageRenderer.on('start', () => this.trigger('start'));
	}

	setSettings(settings) {
		// if ('seed' in settings && settings.seed) {
		// 	this.formRendering.seed = settings.seed;
		// }
		// if ('time' in settings && settings.time) {
		// 	this.formRendering.time = settings.time;
		// }
		// if ('variance' in settings && settings.variance) {
		// 	this.formRendering.variance = settings.variance;
		// }
	}

	restart() {
		// this.imageRenderer.restart();
		// this.imageRendererReport.start();
	}

	start() {
		// this.imageRenderer.start();

		// if (!this.isInitialized) {
		// 	this.isInitialized = true;

		// 	this.formRendering.on('change', debounce(() => this.restart(), 50));
		// }
	}

	stop() {
		// this.imageRenderer.stop();
	}
}
