import Base from './base.js';
import RenderSettings from './render-settings.js';
import ImageSettings from './image-settings.js';
import ImageRenderer from './image-renderer.js';
import ImageRendererReport from './image-renderer-report.js';
import debounce from '../utils/debounce.js';

export default class App extends Base {
	constructor(element) {
		super(element);

		this.imageSettings = new ImageSettings(this.getComponentElement('settings-image'));
		this.renderSettings = new RenderSettings(this.getComponentElement('settings-render'));

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

		this.restartDebounced = debounce(this.restart.bind(this));
		this.restartDebouncedSlow = debounce(this.restart.bind(this), 1000);
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

		this.imageSettings.on('change', this.restartDebouncedSlow);
		this.renderSettings.on('change', this.restartDebounced);
	}

	stop() {
		this.imageRenderer.stop();

		this.imageSettings.off('change', this.restartDebouncedSlow);
		this.renderSettings.off('change', this.restartDebounced);
	}
}
