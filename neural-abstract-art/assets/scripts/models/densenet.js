import ArrayUtils from '../utils/array.js';

export default class Densenet {
	constructor(topology, seed, variance) {
		this.model = Densenet.createModel(topology, seed, variance);
	}

	dispose() {
		tf.dispose(this.model);
	}

	predict(values) {
		return tf.tidy(() => {
			const input = tf.tensor2d(values);

			return ArrayUtils.chunk(this.model.predict(input)
				.add(tf.scalar(1))
				.mul(tf.scalar(0.5))
				.dataSync(), 3);
		});
	}

	static createModel(topology, seed, variance) {
		const initializer = tf.initializers.varianceScaling({
			distribution: 'normal',
			mode: 'fanIn',
			scale: variance,
			seed,
		});

		const inputs = tf.input({ shape: [4] });
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
