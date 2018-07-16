import BaseComponent from './base.js';
import DensenetModel from '../models/densenet.js';
import AnimationLoop from '../utils/animation-loop.js';
import MathUtils from '../utils/math.js';

export default class ImageRendererComponent extends BaseComponent {
	constructor(element, settingsComponent) {
		super(element);

		this.context = this.element.getContext('2d');
		this.imageData = null;
		this.model = null;
		this.settingsComponent = settingsComponent;

		this.animationLoop = new AnimationLoop(frame => this._render(frame));
	}

	download() {
		const {
			height,
			seed,
			time,
			variance,
			width,
		} = this.settingsComponent;

		const filename = `${seed}-${time}-${variance}-${width}x${height}.png`;

		this.context.canvas.toBlob((blob) => {
			if ('msSaveBlob' in window.navigator) {
				window.navigator.msSaveBlob(blob, filename);
				return;
			}

			const url = (window.URL || window.webkitURL).createObjectURL(blob);
			const anchor = document.createElement('a');
			anchor.style.display = 'none';
			anchor.download = filename;
			anchor.href = url;

			// Link has to be attached to DOM to work in Firefox
			document.body.appendChild(anchor);

			// fire click
			anchor.click();

			// Link has to be attached to DOM to work in Firefox
			requestAnimationFrame(() => {
				document.body.removeChild(anchor);
				(window.URL || window.webkitURL).revokeObjectURL(url);
			});
		}, 'image/png');
	}

	start() {
		const {
			height,
			seed,
			variance,
			width,
		} = this.settingsComponent;

		this.element.height = height;
		this.element.width = width;
		this.imageData = this.context.createImageData(width, height);
		this.model = new DensenetModel(seed, variance);

		this.animationLoop.start();
		this.trigger('start');
	}

	stop(callback) {
		this.animationLoop.stop(() => {
			this.model.dispose();

			if (typeof callback === 'function') {
				callback();
			}
		});
	}

	_render(frame) {
		if (frame * this.settingsComponent.batchSize >= this.settingsComponent.pixelCount) {
			this.stop();
			this.trigger('render', 1);
			this.trigger('finish');
			return;
		}

		const pixelIndex = frame * this.settingsComponent.batchSize;
		const progress = Math.min(1, pixelIndex / (this.settingsComponent.pixelCount - 1));

		this._renderPixel(pixelIndex);
		this.trigger('render', progress);
	}

	_renderPixel(pixelIndex) {
		const { aspect } = this.settingsComponent;

		const imageDataIndexStart = 4 * pixelIndex;
		const batchSize = Math.min(
			this.settingsComponent.batchSize,
			this.settingsComponent.pixelCount - pixelIndex);

		const input = new Array(batchSize).fill().map((_, offset) => {
			const x = (pixelIndex + offset) % this.element.width;
			const y = Math.floor((pixelIndex + offset) / this.element.width) % this.element.height;
			const xNormalized = MathUtils.lerp(-1, 1, x / (this.element.width - 1)) * aspect;
			const yNormalized = MathUtils.lerp(-1, 1, y / (this.element.height - 1));

			return [
				xNormalized,
				yNormalized,
				Math.sqrt(xNormalized * xNormalized + yNormalized * yNormalized),
				this.settingsComponent.time,
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
}
