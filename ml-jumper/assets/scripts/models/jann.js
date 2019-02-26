export default class JANNModel {
	constructor() {
		this.model = JANNModel.createTopology();

		this.model.compile({
			loss: 'meanSquaredError',
			optimizer: 'sgd',
		});
	}

	async fit(x, y) {
		const xs = x.expandDims(0);
		const ys = y.expandDims(0);

		await this.model.fit(xs, ys);

		xs.dispose();
		ys.dispose();
	}

	async predict(x) {
		const xs = x.expandDims(0);
		const ys = this.model.predict(xs);
		const y = tf.argMax(ys).dataSync();

		xs.dispose();
		ys.dispose();

		return y;
	}

	static createTopology() {
		const model = tf.sequential();

		model.add(tf.layers.dense({
			activation: 'relu',
			inputShape: [2],
			units: 32,
		}));

		model.add(tf.layers.dense({
			activation: 'relu',
			units: 16,
		}));

		model.add(tf.layers.dense({
			activation: 'relu',
			units: 8,
		}));

		model.add(tf.layers.dense({
			activation: 'linear',
			units: 2,
		}));

		model.add(tf.layers.softmax());

		return model;
	}
}
