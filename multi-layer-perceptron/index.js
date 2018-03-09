const NeuralNetwork = require('./lib/neural-network');

const test = (network, input, target) => {
    const output = network.feedForward(input);
    
    console.log(`The inputs: ${input} should output: ${target}.`);
    console.log('Output:', output);
};

const trainingData = [{
    in: [0, 0],
    target: [0],
}, {
    in: [1, 0],
    target: [1],
}, {
    in: [0, 1],
    target: [1],
}, {
    in: [1, 1],
    target: [0],
}];

const network = new NeuralNetwork(2, 2, 1);

test(network, trainingData[1].in, trainingData[1].target);

trainingData.forEach(entry => network.train(entry.in, entry.target));

test(network, trainingData[1].in, trainingData[1].target);