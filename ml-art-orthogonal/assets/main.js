import animate from './utils/animate.js';
import MathUtils from './utils/math.js';
import Renderer from './renderer.js';

const inputHeight = document.getElementById('input-height');
const inputWidth = document.getElementById('input-width');
const inputSeed = document.getElementById('input-seed');
const inputVariance = document.getElementById('input-variance');

inputSeed.value = Math.round(inputSeed.max * Math.random());

const outputCanvas = document.getElementById('output-canvas');
const outputProgress = document.getElementById('output-progress');
const outputTimeRemaining = document.getElementById('output-time-remaining');

const renderer = new Renderer(outputCanvas, inputWidth.value, inputHeight.value);
renderer.start(inputSeed.value, inputVariance.value);

const duration = renderer.pixelCount / 60 / 8;

animate((_, frame, isLast, stop) => {
	const x = frame % renderer.width;
	const y = Math.floor(frame / renderer.width) % renderer.height;
	const progress = Math.min(1, frame / renderer.pixelCount);
	const progressPercent = `${(progress * 100).toFixed(2)}%`;

	outputProgress.innerText = progressPercent;
	outputTimeRemaining.innerText = `~${MathUtils.lerp(0, duration, 1 - progress).toFixed(0)}s remaining`;

	renderer.update(x, y);

	if (isLast) {
		renderer.render();
	}

	if (frame === renderer.pixelCount) {
		stop();
	}
}, 8);

window.addEventListener('beforeunload', () => renderer.dispose());
