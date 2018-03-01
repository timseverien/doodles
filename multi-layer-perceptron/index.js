const NeuralNetwork = require('./lib/neural-network');

const trainingData = [{
    in: [0, 0],
    out: [0],
}, {
    in: [1, 0],
    out: [1],
}, {
    in: [0, 1],
    out: [1],
}, {
    in: [1, 1],
    out: [0],
}];

const network = new NeuralNetwork(3, 2, 1);
const output = network.feedForward(trainingData[0]);

console.log(output);