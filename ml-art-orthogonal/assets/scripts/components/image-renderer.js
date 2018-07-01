import Base from './base.js';
import DensenetModel from '../models/densenet.js';
import AnimationLoop from '../utils/animation-loop.js';
import MathUtils from '../utils/math.js';

export default class ImageRenderer extends Base {
	constructor(element, imageSettings, renderSettings) {
		super(element);

		this.aspect = 1;
		this.batchSize = 1;
		this.context = this.element.getContext('2d');
		this.imageSettings = imageSettings;
		this.imageData = null;
		this.model = null;
		this.pixelCount = 0;
		this.renderSettings = renderSettings;

		this.animationLoop = new AnimationLoop(frame => this.render(frame));
	}

	dispose() {
		this.model.dispose();
	}

	render(frame) {
		if (frame * this.batchSize >= this.pixelCount) {
			this.stop();
			this.trigger('render', 1);
			return;
		}

		const pixelIndex = frame * this.batchSize;
		const progress = Math.min(1, pixelIndex / this.pixelCount);

		this.renderPixel(pixelIndex);
		this.trigger('render', progress);
	}

	renderPixel(pixelIndex) {
		const imageDataIndexStart = 4 * pixelIndex;
		const batchSize = Math.min(this.batchSize, this.pixelCount - pixelIndex);

		const input = new Array(batchSize).fill().map((_, offset) => {
			const x = (pixelIndex + offset) % this.element.width;
			const y = Math.floor((pixelIndex + offset) / this.element.width) % this.element.height;
			const xNormalized = MathUtils.lerp(-1, 1, x / (this.element.width - 1)) * this.aspect;
			const yNormalized = MathUtils.lerp(-1, 1, y / (this.element.height - 1));

			return [
				xNormalized,
				yNormalized,
				Math.sqrt(xNormalized * xNormalized + yNormalized * yNormalized),
				this.renderSettings.time,
			];
		});

		this.model.predict(input).forEach(([r, g, b], offset) => {
			const imageDataIndex = imageDataIndexStart + 4 * offset;

			this.imageData.data[imageDataIndex + 0] = 255 * r;
			this.imageData.data[imageDataIndex + 1] = 255 * g;
			this.imageData.data[imageDataIndex + 2] = 255 * b;
			this.imageData.data[imageDataIndex + 3] = 255;
		});

		this.context.putImageData(this.imageData, 0, 0);
	}

	restart() {
		this.stop(() => this.start());
	}

	start() {
		const { batchSize, height, width } = this.imageSettings;
		const { seed, variance } = this.renderSettings;

		this.aspect = width / height;
		this.element.height = height;
		this.element.width = width;
		this.imageData = this.context.createImageData(width, height);
		this.model = new DensenetModel('densenet', seed, variance);
		this.pixelCount = height * width;
		this.batchSize = batchSize;

		this.animationLoop.start();
		this.trigger('start');
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
