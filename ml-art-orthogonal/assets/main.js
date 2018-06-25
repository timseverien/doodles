import Renderer from './renderer.js';

const inputHeight = document.getElementById('input-height');
const inputWidth = document.getElementById('input-width');
const inputSeed = document.getElementById('input-seed');
const inputVariance = document.getElementById('input-variance');

inputSeed.value = Math.round(inputSeed.max * Math.random());

const outputCanvas = document.getElementById('output-canvas');
const outputProgress = document.getElementById('output-progress');
const outputTimeRemaining = document.getElementById('output-time-remaining');

const renderer = new Renderer(outputCanvas);
renderer.setSize(inputWidth.value, inputHeight.value);
renderer.start(inputSeed.value, inputVariance.value);

let outputTimeRemainingLastUpdate = -Infinity;

renderer.on('render', () => {
	const now = performance.now();

	const progress = renderer.progress;
	const progressPercent = `${(progress * 100).toFixed(2)}%`;
	const pixelsRemaining = renderer.pixelCount - Math.floor(progress * renderer.pixelCount);
	const timeRemaining = renderer.animationLoop.frameRate > 0
		? Math.max(0, pixelsRemaining / renderer.animationLoop.frameRate / Renderer.UPDATES_PER_FRAME)
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

		renderer.start(inputSeed.value, inputVariance.value);
	});
});

window.addEventListener('beforeunload', () => renderer.dispose());
