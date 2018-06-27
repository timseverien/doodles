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
			this.renderSettings,
		);
		this.imageRendererReport = new ImageRendererReport(
			this.getComponentElement('image-renderer-report'),
			this.imageRenderer,
		);

		this.imageRenderer.start();

		this.getElement('button-apply').addEventListener('click', () => this.imageRenderer.restart());
		this.getElement('button-randomize').addEventListener('click', () => {
			this.renderSettings.randomize();
			this.imageRenderer.restart();
		});
	}

	dispose() {
		this.imageRenderer.stop();
	}
}
