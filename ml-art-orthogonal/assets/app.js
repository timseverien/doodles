import MathUtils from './utils/math.js';
import Renderer from './renderer.js';
import noop from './utils/noop.js';

export default class App {
	constructor($refs) {
		this.$refs = $refs;
		this.renderer = new Renderer(this.$refs.get('output-canvas'));
		this.timeElapsed = 0;
		this.timePrevious = 0;

		this.randomize();

		this.renderer.on('render', () => {
			const now = performance.now();
			const delta = (now - this.timePrevious) / 1000;
			this.timeElapsed += delta;

			this.updateProgress();
			this.updateTimeRemaining();

			this.timePrevious = now;
		});

		this.$refs.get('button-apply').addEventListener('click', () => this.restart());
		this.$refs.get('button-randomize').addEventListener('click', () => {
			this.randomize();
			this.restart();
		});
	}

	randomize() {
		App.randomizeNumericInput(this.$refs.get('input-variance'));
		App.randomizeNumericInput(this.$refs.get('input-seed'));
		this.$refs.get('input-time').value = MathUtils.lerp(-8, 8, Math.random()).toFixed(2);
	}

	restart() {
		this.stop(() => this.start());
	}

	start() {
		this.renderer.updatesPerFrame = Number.parseInt(this.$refs.get('input-updates-per-frame').value);
		this.renderer.height = Number.parseInt(this.$refs.get('input-height').value);
		this.renderer.width = Number.parseInt(this.$refs.get('input-width').value);
		this.renderer.start(
			Number.parseInt(this.$refs.get('input-seed').value),
			Number.parseInt(this.$refs.get('input-variance').value)
		);

		this.timeElapsed = 0;
		this.timePrevious = performance.now();
	}

	stop(callback = noop) {
		this.renderer.stop(callback);
	}

	updateProgress() {
		const progressPercent = `${(this.renderer.progress * 100).toFixed(2)}%`;

		this.$refs.get('output-progress').innerText = progressPercent;
	}

	updateTimeRemaining() {
		const timeTotal = (1 / this.renderer.progress) * this.timeElapsed;
		const timeRemaining = timeTotal - this.timeElapsed;

		this.$refs.get('output-time-remaining').innerText = `~${timeRemaining.toFixed(0)} seconds remaining`;
	}

	static randomizeNumericInput(input) {
		input.value = Math.floor(MathUtils.lerp(input.min, input.max, Math.random()));
	}
}
