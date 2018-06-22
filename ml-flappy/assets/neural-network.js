const createWeights = (a, b) => tf.randomNormal([a, b]);

const createWeightsFromLayers = layers => layers.reduce((weights, layer, index, layers) => {
	if (index === layers.length - 1) {
		return weights;
	}

	const layerA = layer;
	const layerB = layers[index + 1];

	return weights.push(createWeights(layerA, layerB));
}, []);

export class NeuralNetworkInputLayer {
	constructor(size) {
		this.size = size;
	}
}

export class NeuralNetworkLayer {
	constructor(size, fn = 'sigmoid', fnArguments = []) {
		this.activationFunction = fn;
		this.activationFunctionArguments = fnArguments;
		this.size = size;
	}
}

export class NeuralNetwork {
	constructor(...layers) {
		if (typeof layers[0] !== NeuralNetworkInputLayer) {
			throw new Error('The first layer should be a NeuralNetworkInputLayer instance');
		}
		if (!layers.slice(1).some(l => typeof l !== NeuralNetworkLayer)) {
			throw new Error('Layers 2-n should be NeuralNetworkLayer instances');
		}

		this.layers = layers;
		this.weights = createWeightsFromLayers(layers);
	}

	dispose() {
		this.weights.forEach(w => w.dispose());
	}

	predict(inputs) {
		return this.weights.reduce(() => {

		}, inputs);
	}
}
