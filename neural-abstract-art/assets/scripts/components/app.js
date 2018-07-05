import BaseComponent from './base.js';
import ImageRendererComponent from './image-renderer.js';
import ImageRendererReportComponent from './image-renderer-report.js';
import SettingsComponent from './settings.js';

export default class App extends BaseComponent {
	constructor(element) {
		super(element);

		this._rendererReport = new ImageRendererReportComponent(this.getComponentElement('image-renderer-report'));

		this._settings = new SettingsComponent(this.getComponentElement('settings'));
		this._settings.on('change', () => this.restart());
		this._settings.update();

		this._renderer = new ImageRendererComponent(
			this.getComponentElement('image-renderer'),
			this._settings,
		);

		this._renderer.on('finish', () => this.stop());
	}

	restart() {
		this._settings.update();

		this.stop(() => this.start());
	}

	start() {
		this._settings.persist();
		this._renderer.start();
	}

	stop(callback) {
		this._renderer.stop(callback);
	}
}
