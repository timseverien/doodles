import Renderer from './renderer.js';
import MathUtils from './utils/math.js';

const inputHeight = document.getElementById('input-height');
const inputWidth = document.getElementById('input-width');
const inputUpdatesPerFrame = document.getElementById('input-updates-per-frame');
const inputSeed = document.getElementById('input-seed');
const inputVariance = document.getElementById('input-variance');

inputSeed.max = Number.MAX_SAFE_INTEGER;

const randomizeParameters = () => {
	inputSeed.value = Math.floor(MathUtils.lerp(
		Number.parseInt(inputSeed.min),
		Number.parseInt(inputSeed.max),
		Math.random()));

	inputVariance.value = Math.floor(MathUtils.lerp(
		Number.parseInt(inputVariance.min),
		Number.parseInt(inputVariance.max),
		Math.random()));
};

const outputCanvas = document.getElementById('output-canvas');
const outputProgress = document.getElementById('output-progress');
const outputTimeRemaining = document.getElementById('output-time-remaining');

randomizeParameters();

const renderer = new Renderer(outputCanvas);
renderer.updatesPerFrame = inputUpdatesPerFrame.value;
renderer.setSize(inputWidth.value, inputHeight.value);
renderer.start(inputSeed.value, inputVariance.value);

let outputTimeRemainingLastUpdate = -Infinity;

renderer.on('render', () => {
	const now = performance.now();

	const progress = renderer.progress;
	const progressPercent = `${(progress * 100).toFixed(2)}%`;
	const pixelsRemaining = renderer.pixelCount - Math.floor(progress * renderer.pixelCount);
	const timeRemaining = renderer.animationLoop.frameRate > 0
		? Math.max(0, pixelsRemaining / renderer.animationLoop.frameRate / renderer.updatesPerFrame)
		: 0;

	outputProgress.innerText = progressPercent;

	if (now > outputTimeRemainingLastUpdate + 1000) {
		outputTimeRemaining.innerText = `~${timeRemaining.toFixed(0)}s remaining`;
		outputTimeRemainingLastUpdate = now;
	}
});

document.getElementById('button-apply').addEventListener('click', () => {
	renderer.stop(() => {
		if (
			renderer.height !== inputHeight.value ||
			renderer.width !== inputWidth.value
		) renderer.setSize(inputWidth.value, inputHeight.value);

		renderer.updatesPerFrame = inputUpdatesPerFrame.value;
		renderer.start(inputSeed.value, inputVariance.value);
	});
});

document.getElementById('button-randomize').addEventListener('click', () => {
	randomizeParameters();

	renderer.stop(() => {
		if (
			renderer.height !== inputHeight.value ||
			renderer.width !== inputWidth.value
		) renderer.setSize(inputWidth.value, inputHeight.value);

		renderer.updatesPerFrame = inputUpdatesPerFrame.value;
		renderer.start(inputSeed.value, inputVariance.value);
	});
});

window.addEventListener('beforeunload', () => renderer.stop());
