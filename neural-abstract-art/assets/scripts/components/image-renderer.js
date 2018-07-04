import BaseComponent from './base.js';
import DensenetModel from '../models/densenet.js';
import AnimationLoop from '../utils/animation-loop.js';
import MathUtils from '../utils/math.js';

export default class ImageRendererComponent extends BaseComponent {
	constructor(
		element,
		formImage,
		formRendering,
		formRenderSpeed,
	) {
		super(element);

		this.context = this.element.getContext('2d');
		this.formImage = formImage;
		this.formRendering = formRendering;
		this.formRenderSpeed = formRenderSpeed;
		this.imageData = null;
		this.model = null;
		this.pixelCount = 0;

		this.animationLoop = new AnimationLoop(frame => this.render(frame));
	}

	dispose() {
		this.model.dispose();
	}

	render(frame) {
		if (frame * this.formRenderSpeed.batchSize >= this.pixelCount) {
			this.stop();
			this.trigger('render', 1);
			return;
		}

		const pixelIndex = frame * this.formRenderSpeed.batchSize;
		const progress = Math.min(1, pixelIndex / this.pixelCount);

		this.renderPixel(pixelIndex);
		this.trigger('render', progress);
	}

	renderPixel(pixelIndex) {
		const { aspect } = this.formImage;

		const imageDataIndexStart = 4 * pixelIndex;
		const batchSize = Math.min(this.formRenderSpeed.batchSize, this.pixelCount - pixelIndex);

		const input = new Array(batchSize).fill().map((_, offset) => {
			const x = (pixelIndex + offset) % this.element.width;
			const y = Math.floor((pixelIndex + offset) / this.element.width) % this.element.height;
			const xNormalized = MathUtils.lerp(-1, 1, x / (this.element.width - 1)) * aspect;
			const yNormalized = MathUtils.lerp(-1, 1, y / (this.element.height - 1));

			return [
				xNormalized,
				yNormalized,
				Math.sqrt(xNormalized * xNormalized + yNormalized * yNormalized),
				this.formRendering.time,
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
		const { height, width } = this.formImage;
		const { seed, variance } = this.formRendering;

		this.element.height = height;
		this.element.width = width;
		this.imageData = this.context.createImageData(width, height);
		this.model = new DensenetModel('densenet', seed, variance);
		this.pixelCount = height * width;

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
