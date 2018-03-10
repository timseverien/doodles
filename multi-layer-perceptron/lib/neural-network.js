const Matrix = require('./math/matrix');

const arrayReverse = arr => new arr.constructor(arr.length).fill()
	.map((_, index) => arr[arr.length - index - 1]);

// Activation functions
const activationFunctions = {
	sigmoid(x) {
		return 1 / (1 + Math.exp(-x));
	},
};

class InputLayer {
	constructor(nodeCount) {
		this.nodeCount = nodeCount;
	}

	feedForward(inputs) {
		if (!(inputs instanceof Matrix)) {
			throw new Error(`${inputs} is not a matrix`);
		}

		if (this.nodeCount !== inputs.rowCount) {
			throw new Error(`Layer expects a matrix with ${this.nodeCount} rows`);
		}

		return inputs;
	}
}

class Layer {
	constructor(nodeCount, previousLayerNodeCount) {
		this.weights = new Matrix(nodeCount, previousLayerNodeCount).randomize();
	}

	feedForward(inputs, activationFunction = 'sigmoid') {
		if (!(inputs instanceof Matrix)) {
			throw new Error(`${inputs} is not a matrix`);
		}

		if (this.weights.columnCount !== inputs.rowCount) {
			throw new Error(`Layer expects a matrix with ${this.weights.columnCount} rows`);
		}

		return Matrix.product(this.weights, inputs)
			.map(activationFunctions[activationFunction]);
	}
}

module.exports = class NeuralNetwork {
	constructor(...layerNodeCounts) {
		this.activationFunction = 'sigmoid';
		this.learningRate = 0.1;

		this.layers = layerNodeCounts.map((nodeCount, layerIndex) => {
			if (layerIndex === 0) return new InputLayer(nodeCount);
			return new Layer(nodeCount, layerNodeCounts[layerIndex - 1]);
		});
	}

	feedForward(inputsArray) {
		let output = Matrix.fromArray(inputsArray);

		this.layers.forEach(layer => (output = layer.feedForward(output, this.activationFunction)));

		return output.toArray();
	}

	feedForwardTrain(inputsArray) {
		let output = Matrix.fromArray(inputsArray);

		return this.layers.map((layer, layerIndex) => {
			const layerInput = output;
			const layerOutput = layer.feedForward(layerInput, this.activationFunction);

			output = layerOutput;

			return {
				layer: layer,
				input: layerInput,
				output: layerOutput,
			};
		});
	}

	train(inputsArray, targetArray) {
		const layerData = this.feedForwardTrain(inputsArray);
		const output = layerData[layerData.length - 1].output;
		const target = Matrix.fromArray(targetArray);
		const errorOutput = target.clone().subtract(output);
		let errorLayer = errorOutput;

		arrayReverse(layerData).forEach((layerData, layerIndex, layerDataArray) => {
			if (layerData.layer instanceof InputLayer) return;

			const layerPrevious = layerDataArray[layerIndex + 1];

			const gradient = layerData.output.clone()
				.map(x => x * (1 - x))
				.multiply(errorLayer)
				.multiplyScalar(this.learningRate);
			
			layerData.layer.weights
				.add(Matrix.product(gradient, Matrix.transpose(layerPrevious.output)));

			errorLayer = Matrix.product(Matrix.transpose(layerData.layer.weights), errorLayer);
		});
	}
}
