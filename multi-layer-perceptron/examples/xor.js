const NeuralNetwork = require('../lib/neural-network');
const InputUtils = require('../lib/utils/input');

const trainingData = require('./xor.json');
const network = new NeuralNetwork(3, 3, 1);

for (let i = 0; i < Math.pow(2, 16); i++) {
	const entry = trainingData[i % trainingData.length];
	network.train(InputUtils.addBias(entry.in), entry.target);
}

trainingData.forEach((entry) => {
	const result = network.feedForward(InputUtils.addBias(entry.in));
	console.log(`${entry.in[0]} XOR ${entry.in[1]} = ${result[0].toFixed(4)}`);
});
