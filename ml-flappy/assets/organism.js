export default class Organism {
	constructor(brain = Organism.getBrain()) {
		this.brain = brain;
	}

	getScore() {
		return 0;
	}

	static fromParents(a, b, mutationRate = 0.01) {
		console.log(a.brain, b.brain);

		const aWeights = a.brain.getWeights();
		const bWeights = b.brain.getWeights();
		const aData = aWeights.dataSync();
		const bData = bWeights.dataSync();

		return new Array(aData.length).fill()
			.map((_, layerIndex) => new Array(aData[layerIndex].length)
				.map((_, weightIndex) => {
					// Mutation
					if (Math.random() < mutationRate) {
						return Math.random() * 2 - 1;
					}

					// Crossover
					return Math.random() < 0.5
						? aData[layerIndex][weightIndex]
						: bData[layerIndex][weightIndex];
				}));
	}

	static getBrain() {
		const model = tf.sequential({
			layers: [
				tf.layers.dense({
					units: 1,
					inputShape: [4],
				}),
			],
		});

		model.compile({
			loss: 'meanSquaredError',
			optimizer: 'sgd',
		});

		return model;
	}
}
