const Matrix = require('./matrix');

const arrayReverse = arr => new arr.constructor(arr.length).fill()
    .map((_, index) => arr[arr.length - index - 1]);

// const activationFunctions = {
//     sigmoid(x) {
//         return 1 / (1 + Math.exp(-x));
//     }
// };

// What the fuck?
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

    feedForward(inputs) {
        if (!(inputs instanceof Matrix)) {
            throw new Error(`${inputs} is not a matrix`);
        }

        if (this.weights.columnCount !== inputs.rowCount) {
            throw new Error(`Layer expects a matrix with ${this.weights.columnCount} rows`);
        }

        // TODO: Run activation function
        return Matrix.product(this.weights, inputs);
    }
}

module.exports = class NeuralNetwork {
    constructor(...layerNodeCounts) {
        this.learningRate = 0.1;

        this.layers = layerNodeCounts.map((nodeCount, layerIndex) => {
            if (layerIndex === 0) return new InputLayer(nodeCount);
            return new Layer(nodeCount, layerNodeCounts[layerIndex - 1]);
        });
    }

    feedForward(inputsArray) {
        let output = Matrix.fromArray(inputsArray);

        this.layers.forEach(layer => (output = layer.feedForward(output)));

        return output.toArray();
    }

    feedForwardTrain(inputsArray) {
        let output = Matrix.fromArray(inputsArray);

        return this.layers.map((layer) => {
            const layerInput = output;
            const layerOutput = layer.feedForward(layerInput);

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
        let error = target.clone().subtract(output);

        arrayReverse(layerData).forEach((layerData, layerIndex, layerDataArray) => {
            if (layerIndex === layerDataArray.length - 1) return;

            // if i > 0
            const layerDataPrevious = layerDataArray[layerIndex + 1];

            // TODO: Calculate derivitive of activation function:
            // const gradient = output[index] * (1 - output[index])
            const weightsTransposed = Matrix.transpose(layerDataPrevious.output);
            const layerError = layerIndex === 0 ? error : Matrix.product(weightsTransposed, error);

            const gradient = Matrix.multiply(output, layerError).multiplyScalar(this.learningRate);
            const weightsDelta = Matrix.product(gradient, weightsTransposed);

            layerData.layer.weights.add(weightsDelta);
            error = layerError;
        });
    }
}