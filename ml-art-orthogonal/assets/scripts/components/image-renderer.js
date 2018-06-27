import Base from './base.js';
import DensenetModel from '../models/densenet.js';
import AnimationLoop from '../utils/animation-loop.js';
import MathUtils from '../utils/math.js';

export default class ImageRenderer extends Base {
	constructor(element, imageSettings, renderSettings) {
		super(element);

		this.aspect = 1;
		this.context = this.element.getContext('2d');
		this.imageSettings = imageSettings;
		this.model = null;
		this.pixelCount = 0;
		this.renderSettings = renderSettings;
		this.updatesPerFrame = 1;

		this.animationLoop = new AnimationLoop(frame => this.render(frame));
	}

	dispose() {
		this.model.dispose();
	}

	render(frame) {
		if (frame >= this.pixelCount) {
			this.stop();
			return;
		}

		const pixel = frame * this.updatesPerFrame;

		const progress = Math.min(1, pixel / this.pixelCount);

		for (let i = 0; i < this.updatesPerFrame; i++) {
			const x = (pixel + i) % this.element.width;
			const y = Math.floor((pixel + i) / this.element.width) % this.element.height;

			this.renderPixel(x, y);
		}

		this.trigger('render', progress);
	}

	renderPixel(x, y) {
		const xNormalized = MathUtils.lerp(-1, 1, x / (this.element.width - 1)) * this.aspect;
		const yNormalized = MathUtils.lerp(-1, 1, y / (this.element.height - 1));
		const [r, g, b] = this.model.predict([
			xNormalized,
			yNormalized,
			Math.sqrt(xNormalized * xNormalized + yNormalized * yNormalized),
			-1.6
		]);

		this.context.fillStyle = `rgb(${255 * r}, ${255 * g}, ${255 * b})`;
		this.context.fillRect(x, y, 1, 1);
	}

	restart() {
		this.stop(() => this.start());
	}

	start() {
		this.aspect = this.imageSettings.width / this.imageSettings.height;
		this.element.height = this.imageSettings.height;
		this.element.width = this.imageSettings.width;
		this.pixelCount = this.imageSettings.height * this.imageSettings.width;
		this.updatesPerFrame = this.imageSettings.updatesPerFrame;

		this.model = new DensenetModel('densenet', this.renderSettings.seed, this.renderSettings.variance);

		this.context.clearRect(0, 0, this.imageSettings.width, this.imageSettings.height);
		this.animationLoop.start();
	}

	stop(callback) {
		this.animationLoop.stop(() => {
			this.dispose();

			if (typeof callback === 'function') {
				callback();
			}
		});
	}
}
