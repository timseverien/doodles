export default class Brain {
	constructor(model = null) {
		this._model = (model instanceof tf.Model)
			? model
			: Brain.getModel();
	}

	predict(input) {
		return this._model.predict(input);
	}

	static fromParents(a, b, mutationRate = 0.01) {
		const aWeights = a._model.getWeights();
		const bWeights = b._model.getWeights();
		const aData = aWeights.map(w => w.dataSync());
		const bData = bWeights.map(w => w.dataSync());

		const layerCount = aData.length;
		const newBrain = Brain.getModel();

		newBrain.setWeights(new Array(layerCount).fill()
			.map((_, layerIndex) => {
				const nodeCount = aData[layerIndex].length;
				const shape = aWeights[layerIndex].shape;

				return tf.tensor(new Array(nodeCount).fill()
					.map((_, weightIndex) => {
						// Mutation
						if (Math.random() < mutationRate) {
							return Math.random() * 2 - 1;
						}

						// Crossover
						return Math.random() < 0.5
							? aData[layerIndex][weightIndex]
							: bData[layerIndex][weightIndex];
					}), shape);
			}));

		return new Brain(newBrain);
	}

	static getModel() {
		const model = tf.sequential();

		model.add(tf.layers.dense({
			inputShape: Brain.INPUT_SHAPE,
			kernelInitializer: 'randomUniform',
			units: 2,
		}));

		model.add(tf.layers.dense({
			activation: 'relu',
			kernelInitializer: 'randomUniform',
			units: 1,
		}));

		model.compile({
			loss: 'meanSquaredError',
			optimizer: 'sgd',
		});

		return model;
	}

	static get INPUT_SHAPE() {
		return [4];
	}
}
