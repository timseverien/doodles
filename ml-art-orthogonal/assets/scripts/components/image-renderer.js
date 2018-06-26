import Base from './base.js';
import AnimationLoop from '../utils/animation-loop.js';

export default class ImageRenderer extends Base {
	constructor(element, imageSettings, renderSettings) {
		super(element);

		this.canvas = this.getElement('output-canvas');
		this.context = this.canvas.getContext('2d');
		this.imageSettings = imageSettings;
		this.renderSettings = renderSettings;

		this.animationLoop = new AnimationLoop((time, frame) => this.render(time, frame));
	}

	dispose() {

	}

	render(time, frame) {

	}

	restart() {
		this.stop(() => this.start());
		this.trigger('render');
	}

	start() {
		this.canvas.height = this.imageSettings.height;
		this.canvas.width = this.imageSettings.width;

		console.log(this.imageSettings, this.renderSettings);
	}

	stop(callback) {
		this.animationLoop.stop(callback);
	}

	update() {
		this.trigger('update');
	}
}
