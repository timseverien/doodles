export default class Densenet {
	constructor(size, seed, variance) {
		this.model = Densenet.createModel(size, seed, variance);
	}

	predict(x) {
		return tf.tidy(() => {
			const y = this.model.predict(x.expandDims(0))
				.add(tf.scalar(1))
				.mul(tf.scalar(0.5));

			return tf.unstack(y).pop();
		});
	}

	static createModel(size, seed, variance) {
		const initializer = tf.initializers.varianceScaling({
			distribution: 'normal',
			mode: 'fanIn',
			scale: variance,
			seed,
		});

		const inputs = tf.input({ shape: [size, size, 4] });
		let outputs = Densenet.createDensityTopology(inputs, initializer);

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

	static createDensityTopology(x, kernelInitializer, depth = 8, width = 8) {
		for (let i = 0; i < depth; i++) {
			let y = tf.layers.dense({
				activation: 'sigmoid',
				kernelInitializer,
				units: width,
			}).apply(x);

			x = tf.layers.concatenate({}).apply([x, y]);
		}

		return x;
	}
}
