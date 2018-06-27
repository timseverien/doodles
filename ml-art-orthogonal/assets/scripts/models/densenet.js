export default class Densenet {
	constructor(topology, seed, variance) {
		this.model = Densenet.createModel(topology, seed, variance);
	}

	dispose() {
		tf.dispose(this.model);
	}

	predict(values) {
		if (values.length !== 4) {
			throw new Error(`Input should be an Array of 4 items, got ${values.length}`);
		}

		return tf.tidy(() => {
			const input = tf.tensor(values, [1, 4]);

			return this.model.predict(input)
				.add(tf.scalar(1))
				.mul(tf.scalar(0.5))
				.dataSync();
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

// const kernelInitializer = tf.initializers.varianceScaling({
// 	distribution: 'normal',
// 	mode: 'fanIn',
// 	scale: variance,
// 	seed,
// });

// const inputs = tf.input({ shape: [4] });
// let outputs = inputs;

// for (let i = 0; i < depth; i++) {
// 	let layer = tf.layers.dense({
// 		activation: 'sigmoid',
// 		kernelInitializer: kernelInitializer,
// 		units: width,
// 	}).apply(outputs);

// 	outputs = tf.layers.concatenate({}).apply([outputs, layer]);
// }

// outputs = tf.layers.dense({
// 	activation: 'tanh',
// 	kernelInitializer: tf.initializers.glorotNormal({ seed }),
// 	units: 3,
// }).apply(outputs);

// return tf.model({
// 	inputs,
// 	outputs,
// });
