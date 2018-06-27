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

		this.imageRenderer = new ImageRenderer(
			this.getComponentElement('image-renderer'),
			this.imageSettings,
			this.renderSettings);

		this.imageRendererReport = new ImageRendererReport(
			this.getComponentElement('image-renderer-report'),
			this.imageRenderer);

		this.getElement('button-apply').addEventListener('click', () => {
			this.imageRenderer.restart();
			this.imageRendererReport.start();
			this.trigger('settingChange');
		});

		this.getElement('button-randomize').addEventListener('click', () => {
			this.renderSettings.randomize();
			this.imageRenderer.restart();
			this.imageRendererReport.start();
			this.trigger('settingChange');
		});
	}

	dispose() {
		this.imageRenderer.stop();
	}

	setSettings(settings) {
		if ('height' in settings) {
			this.imageSettings.height = settings.height;
		}
		if ('width' in settings) {
			this.imageSettings.width = settings.width;
		}

		if ('seed' in settings) {
			this.renderSettings.seed = settings.seed;
		}
		if ('time' in settings) {
			this.renderSettings.time = settings.time;
		}
		if ('variance' in settings) {
			this.renderSettings.variance = settings.variance;
		}
	}

	start() {
		this.imageRenderer.start();
	}
}
