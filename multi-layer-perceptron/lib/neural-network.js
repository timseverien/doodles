const Matrix = require('./matrix');

class Layer {
    constructor(nodeCount) {
        this.nodes = new Matrix(nodeCount, 1);
        this.biases = new Matrix(nodeCount, 1).randomize();
    }
}

class WeightedLayer extends Layer {
    constructor(nodeCount, previousLayerNodeCount) {
        super(nodeCount);
        this.weights = new Matrix(nodeCount, previousLayerNodeCount).randomize();
    }

    feedForward(inputs) {
        // TODO
    }
}

module.exports = class NeuralNetwork {
    constructor(...layerNodeCounts) {
        this.layers = layerNodeCounts.map((nodeCount, layerIndex) => {
            if (layerIndex === 0) return new Layer(nodeCount);
            return new WeightedLayer(nodeCount, layerNodeCounts[layerIndex - 1]);
        });
    }

    feedForward(inputsArray) {
        const inputs = Matrix.fromArray(inputsArray);
        let previousOutput = inputs;

        this.layers.forEach((layer, layerIndex) => layer.feedForward(previousOutput));
    }

    train() {

    }
}