import BaseComponent from './base.js';
import ImageRendererComponent from './image-renderer.js';
import ImageRendererReportComponent from './image-renderer-report.js';
import SettingsComponent from './settings.js';

export default class App extends BaseComponent {
	constructor(element) {
		super(element);

		this._buttonDownload = this.getElement('button-download');
		this._rendererReport = new ImageRendererReportComponent(this.getComponentElement('image-renderer-report'));

		this._settings = new SettingsComponent(this.getComponentElement('settings'));
		this._settings.on('change', () => this.restart());
		this._settings.update();

		this._renderer = new ImageRendererComponent(
			this.getComponentElement('image-renderer'),
			this._settings,
		);

		this._renderer.on('start', () => {
			this._rendererReport.start();
			this._buttonDownload.disabled = true;
		});

		this._renderer.on('render', (progress) => {
			this._rendererReport.update(progress)
		});

		this._renderer.on('finish', () => {
			this._buttonDownload.disabled = false;
		});

		this._buttonDownload.addEventListener('click', () => {
			if (this._buttonDownload.disabled) return;
			this._renderer.download();
		});
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
