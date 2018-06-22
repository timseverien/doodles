const pick = (a, b, probability = 0.5) => Math.random() < probability ? b : a;
const randomUniform = () => Math.random() * 2 - 1;

const zip = (a, b) => {
	if (a.length !== b.length) {
		throw new Error(`Arrays ${a} and ${b} should have the same length`);
	}

	return new Array(a.length).fill()
		.map((_, index) => [a[index], b[index]]);
};

const MUTATE_OPTIONS_DEFAULT = {
	getValue: randomUniform,
	probability: 0.01,
};

export default {
	crossover(aWeights, bWeights) {
		return aWeights.map((weight, index) => {
			return pick(weight, bWeights[index]);
		});
	},

	getWeightsFromParentWeights(a, b, mutateOptions = {}) {
		return zip(a, b).map(([aTensor, bTensor]) => {
			const aWeights = aTensor.dataSync();
			const bWeights = bTensor.dataSync();
			const shape = aTensor.shape;
			const weights = this.mutate(
				this.crossover(aWeights, bWeights),
				mutateOptions
			);

			return tf.tensor(weights, shape);
		});
	},

	mutate(weights, opts = {}) {
		const options = Object.assign({}, opts, MUTATE_OPTIONS_DEFAULT);

		return weights.map((weight) => {
			return pick(weight, options.getValue(weight), options.probability);
		});
	},
};
