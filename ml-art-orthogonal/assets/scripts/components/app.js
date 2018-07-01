import debounce from '../utils/debounce.js';

import Base from './base.js';
import RenderSettings from './render-settings.js';
import ImageSettings from './image-settings.js';
import ImageRenderer from './image-renderer.js';
import ImageRendererReport from './image-renderer-report.js';

export default class App extends Base {
	constructor(element) {
		super(element);

		this.imageSettings = new ImageSettings(this.getComponentElement('settings-image'));
		this.renderSettings = new RenderSettings(this.getComponentElement('settings-render'));
		this.isInitialized = false;

		this.imageRenderer = new ImageRenderer(
			this.getComponentElement('image-renderer'),
			this.imageSettings,
			this.renderSettings);

		this.imageRendererReport = new ImageRendererReport(
			this.getComponentElement('image-renderer-report'),
			this.imageRenderer);

		this.imageRenderer.on('start', () => this.trigger('start'));

		this.getElement('button-randomize').addEventListener('click', () => {
			this.renderSettings.randomize();
		});
	}

	setSettings(settings) {
		if ('height' in settings && settings.height) {
			this.imageSettings.height = settings.height;
		}
		if ('width' in settings && settings.width) {
			this.imageSettings.width = settings.width;
		}

		if ('seed' in settings && settings.seed) {
			this.renderSettings.seed = settings.seed;
		}
		if ('time' in settings && settings.time) {
			this.renderSettings.time = settings.time;
		}
		if ('variance' in settings && settings.variance) {
			this.renderSettings.variance = settings.variance;
		}
	}

	restart() {
		this.imageRenderer.restart();
		this.imageRendererReport.start();
	}

	start() {
		this.imageRenderer.start();

		if (!this.isInitialized) {
			this.isInitialized = true;

			this.imageSettings.on('change', debounce(() => this.restart(), 1000));
			this.imageSettings.on('change:immediate', () => this.restart());
			this.renderSettings.on('change', debounce(() => this.restart(), 50));
		}
	}

	stop() {
		this.imageRenderer.stop();
	}
}
