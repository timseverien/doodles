import BaseComponent from './base.js';
import DensenetModel from '../models/densenet.js';

export default class ImageRendererComponent extends BaseComponent {
	constructor(element, settingsComponent) {
		super(element);

		this.context = this.element.getContext('2d');
		this.settingsComponent = settingsComponent;

		this.canvasSegment = document.createElement('canvas');
		this.canvasSegment.height = ImageRendererComponent.SEGMENT_SIZE;
		this.canvasSegment.width = ImageRendererComponent.SEGMENT_SIZE;

		this.inputDataWorker = new Worker(`assets/workers/input-data.js?_=${Date.now()}`);
		this.inputDataWorker.addEventListener('message', (e) => {
			const { data, xOffset, yOffset } = e.data;

			this._render(data, xOffset, yOffset);
		});

		this.renderQueue = [];
		this.renderQueueTotalLength = 0;
	}

	download() {
		const {
			height,
			seed,
			time,
			sharpness,
			width,
		} = this.settingsComponent;

		const filename = `${seed}-${time}-${sharpness}-${width}x${height}.png`;

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

	startRender() {
		const offset = ImageRendererComponent.SEGMENT_OFFSET;
		const size = ImageRendererComponent.SEGMENT_SIZE;

		const {
			height,
			seed,
			sharpness,
			width,
		} = this.settingsComponent;

		const xSegments = Math.ceil(width / offset);
		const ySegments = Math.ceil(height / offset);

		this.element.height = height;
		this.element.width = width;

		this.model = new DensenetModel(ImageRendererComponent.SEGMENT_SIZE, seed, sharpness);
		this.renderQueue = [];

		for (let y = 0; y < ySegments; y++) {
			for (let x = 0; x < xSegments; x++) {
				this.renderQueue.push({
					height,
					xOffset: x * offset,
					yOffset: y * offset,
					size,
					time: this.settingsComponent.time,
					width,
				});
			}
		}

		this.renderQueueTotalLength = this.renderQueue.length;

		this._renderNext();
		this.trigger('start');
	}

	_render(data, xOffset, yOffset) {
		const y = tf.tidy(() => this.model.predict(tf.tensor(data, ImageRendererComponent.SEGMENT_SHAPE)));

		tf.toPixels(y, this.canvasSegment)
			.then(() => tf.nextFrame())
			.then(() => {
				this.context.drawImage(this.canvasSegment, xOffset, yOffset);
				this._renderNext();
			});
	}

	_renderNext() {
		if (this.renderQueue.length === 0) {
			this.trigger('finish');
			return;
		}

		this.trigger('progress', (this.renderQueueTotalLength - this.renderQueue.length) / this.renderQueueTotalLength);

		this.inputDataWorker.postMessage(this.renderQueue.shift());
	}

	static get SEGMENT_SIZE() {
		return 256;
	}

	static get SEGMENT_OFFSET() {
		return ImageRendererComponent.SEGMENT_SIZE - 2;
	}

	static get SEGMENT_SHAPE() {
		return [
			ImageRendererComponent.SEGMENT_SIZE,
			ImageRendererComponent.SEGMENT_SIZE,
			4
		];
	}
}
