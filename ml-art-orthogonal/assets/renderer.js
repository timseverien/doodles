export default class Renderer {
	constructor(canvas, width, height) {
		this.context = canvas.getContext('2d');
		this.context.canvas.height = height;
		this.context.canvas.width = width;

		this.aspect = width / height;
		this.height = height;
		this.width = width;

		this.imageData = this.context.createImageData(this.width, this.height);
		this.model = null;
	}

	start(seed, variance) {
		if (this.model) {
			tf.dispose(this.model);
		}

		this.model = Renderer.createModel(seed, variance, 8, 32);
	}

	dispose() {
		tf.dispose(this.model);
	}

	render() {
		this.context.putImageData(this.imageData, 0, 0);
	}

	update(x, y) {
		const imageDataIndex = 4 * (x + y * this.width);
		const xNormalized = (x / (this.width - 1) * 2 - 1) * 0.5 * this.aspect;
		const yNormalized = y / (this.height - 1) * 2 - 1;
		const input = [
			xNormalized,
			yNormalized,
			Math.sqrt(xNormalized * xNormalized + yNormalized * yNormalized),
		];

		const lightness = tf.tidy(() => {
			return this.model
				.predict(tf.tensor(input, [1, input.length]))
				.dataSync();
		});

		this.imageData.data[imageDataIndex + 0] = 255 * lightness;
		this.imageData.data[imageDataIndex + 1] = 255 * lightness;
		this.imageData.data[imageDataIndex + 2] = 255 * lightness;
		this.imageData.data[imageDataIndex + 3] = 255;
	}

	get pixelCount() {
		return this.height * this.width;
	}

	static createModel(seed, variance, depth = 8, width = 32) {
		const kernelInitializer = tf.initializers.varianceScaling({
			distribution: 'normal',
			mode: 'fanIn',
			scale: variance,
			seed,
		});

		const inputs = tf.input({ shape: [3] });
		let outputs = inputs;

		for (let i = 0; i < depth; i++) {
			outputs = tf.layers.dense({
				activation: 'tanh',
				kernelInitializer: kernelInitializer,
				units: width,
			}).apply(outputs);
		}

		outputs = tf.layers.dense({
			activation: 'tanh',
			kernelInitializer: tf.initializers.glorotNormal({ seed }),
			units: 1,
		}).apply(outputs);

		return tf.model({
			inputs,
			outputs,
		});
	}
}
