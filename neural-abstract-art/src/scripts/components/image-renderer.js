import BaseComponent from './base.js';
import DensenetModel from '../models/densenet.js';
import WorkerQueue from '../utils/worker-queue.js';

export default class ImageRendererComponent extends BaseComponent {
	constructor(element, settingsComponent) {
		super(element);

		this.context = this.element.getContext('2d');
		this.settingsComponent = settingsComponent;

		this.canvasSegment = document.createElement('canvas');
		this.canvasSegment.height = ImageRendererComponent.SEGMENT_SIZE;
		this.canvasSegment.width = ImageRendererComponent.SEGMENT_SIZE;

		this._segmentCount = 0;

		this._segmentQueue = new WorkerQueue(`assets/workers/input-data.js?_=${Date.now()}`);
		this._segmentQueue.on('message', ({ data, xOffset, yOffset }) => {
			this._render(data, xOffset, yOffset)
				.then(() => {
					const queueSize = this._segmentQueue.queueSize;

					this.trigger('progress', (this._segmentCount - queueSize) / this._segmentCount);

					if (!this._segmentQueue.isEmpty) {
						this._segmentQueue.run();
					} else {
						this.trigger('finish');
					}
				});
		});
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

	start() {
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

		this._segmentCount = xSegments * ySegments;
		this._segmentQueue.clear();

		this.element.height = height;
		this.element.width = width;

		this.model = new DensenetModel(ImageRendererComponent.SEGMENT_SIZE, seed, sharpness);
		this.trigger('start');

		for (let i = 0; i < this._segmentCount; i++) {
			const x = i % xSegments;
			const y = Math.floor(i / xSegments);
			const xOffset = x * offset;
			const yOffset = y * offset;

			this._segmentQueue.queue({
				height,
				xOffset,
				yOffset,
				size,
				time: this.settingsComponent.time,
				width,
			});
		}

		this._segmentQueue.run();
	}

	_render(data, xOffset, yOffset) {
		const y = tf.tidy(() => this.model.predict(tf.tensor(data, ImageRendererComponent.SEGMENT_SHAPE)));

		return tf.toPixels(y, this.canvasSegment)
			.then(() => this.context.drawImage(this.canvasSegment, xOffset, yOffset));
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
