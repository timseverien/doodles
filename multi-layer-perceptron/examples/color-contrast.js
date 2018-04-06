const NeuralNetwork = require('../lib/neural-network');
const InputUtils = require('../lib/utils/input');
const Color = require('./lib/color');

const getInputFromColors = (a, b) => {
	// return InputUtils.addBias([
	// 	Color.getLuminance(a),
	// 	Color.getLuminance(b)
	// ]);

	return InputUtils.addBias([
		...a.rgb,
		...b.rgb,
	]);
};

const getRandomSampleArray = (sampleCount) => {
	return new Array(sampleCount).fill().map(_ => [
		Color.random(),
		Color.random(),
	]);
};

const getSampleArray = (sampleCount) => {
	const possibilities = 0xFFFFFF * 0xFFFFFF;

	return new Array(sampleCount).fill().map((_, index) => {
		const indexColorSpace = Math.floor((index / (sampleCount - 1)) * possibilities);
		const a = new Color(indexColorSpace % 0xFFFFFF);
		const b = new Color(Math.floor(indexColorSpace / 0xFFFFFF));

		return [a, b];
	});
};

const sampleCount = Math.pow(2, 16);
const samples = getSampleArray(sampleCount);

const network = new NeuralNetwork(7, 7, 1);
network.learningRate = 0.001;

for (let i = 0; i < 16; i++) {
	getRandomSampleArray(sampleCount).concat(samples).forEach(([a, b], index) => {
		const input = getInputFromColors(a, b);
		const target = [Color.getContrastRatio(a, b) / 21];
		
		network.train(input, target);
	});
	
	const errorRate = getRandomSampleArray(sampleCount).reduce((sumError, [a, b]) => {
		const input = getInputFromColors(a, b);
		const target = Color.getContrastRatio(a, b);
		const targetContrastRatio = Color.getContrastRatio(a, b) / 21; 
		const result = network.feedForward(input);

		return sumError + targetContrastRatio - result[0];
	}, 0) / sampleCount;

	console.log(`Error ratio: ${(errorRate * 100).toFixed(8)} %`);
}
