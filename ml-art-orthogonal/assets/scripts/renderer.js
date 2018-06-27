import EventEmitter from './utils/event-emitter.js';
import AnimationLoop from './utils/animation-loop.js';
import noop from './utils/noop.js';

export default class Renderer extends EventEmitter {
	constructor(canvas) {
		super();

		this.context = canvas.getContext('2d');

		this.imageData = null;
		this.model = null;
		this.progress = 0;
		this.updatesPerFrame = 1;
		this.z = 0;

		this.animationLoop = new AnimationLoop((_, frame) => {
			for (let i = 0; i < this.updatesPerFrame; i++) {
				this.update(this.updatesPerFrame * frame + i);
			}

			this.render();

			if (this.isDone) {
				this.animationLoop.stop(() => {
					this.trigger('done');
				});
			}
		});
	}

	render() {
		this.context.putImageData(this.imageData, 0, 0);
		this.trigger('render');
	}

	start(seed, variance, z = 0) {
		if (this.model) {
			tf.dispose(this.model);
			this.model = null;
		}

		this.imageData = this.context.createImageData(this.width, this.height);
		this.model = Renderer.createModel(seed, variance);
		this.progress = 0;
		this.z = z;

		this.animationLoop.start();

		this.trigger('start');
	}

	stop(callback = noop) {
		if (this.model) {
			tf.dispose(this.model);
			this.model = null;
		}

		this.animationLoop.stop(callback);
		this.trigger('stop');
	}

	update(epoch) {
		this.progress = Math.min(1, epoch / this.pixelCount);

		const aspect = this.width / this.height;
		const imageDataIndex = 4 * epoch;
		const x = epoch % this.width;
		const y = Math.floor(epoch / this.width) % this.height;
		const xNormalized = (x / (this.width - 1) * 2 - 1) * aspect;
		const yNormalized = y / (this.height - 1) * 2 - 1;
		const input = [
			xNormalized,
			yNormalized,
			Math.sqrt(xNormalized * xNormalized + yNormalized * yNormalized),
			this.z,
		];

		const [r, g, b] = tf.tidy(() => {
			return this.model
				.predict(tf.tensor(input, [1, input.length]))
				.mul(tf.scalar(0.5))
				.add(tf.scalar(0.5))
				.dataSync();
		});

		this.imageData.data[imageDataIndex + 0] = 255 * r;
		this.imageData.data[imageDataIndex + 1] = 255 * g;
		this.imageData.data[imageDataIndex + 2] = 255 * b;
		this.imageData.data[imageDataIndex + 3] = 255;

		this.trigger('update');
	}

	set height(height) {

		this.context.canvas.height = height;
	}

	get height() {
		return this.context.canvas.height;
	}

	get isDone() {
		return this.progress === 1;
	}

	get pixelCount() {
		return this.height * this.width;
	}

	set width(width) {
		this.context.canvas.width = width;
	}

	get width() {
		return this.context.canvas.width;
	}

	static createModel(seed, variance, depth = 8, width = 8) {
		const kernelInitializer = tf.initializers.varianceScaling({
			distribution: 'normal',
			mode: 'fanIn',
			scale: variance,
			seed,
		});

		const inputs = tf.input({ shape: [4] });
		let outputs = inputs;

		for (let i = 0; i < depth; i++) {
			let layer = tf.layers.dense({
				activation: 'sigmoid',
				kernelInitializer: kernelInitializer,
				units: width,
			}).apply(outputs);

			outputs = tf.layers.concatenate({}).apply([outputs, layer]);
		}

		outputs = tf.layers.dense({
			activation: 'tanh',
			kernelInitializer: tf.initializers.glorotNormal({ seed }),
			units: 3,
		}).apply(outputs);

		return tf.model({
			inputs,
			outputs,
		});
	}
}
