import MathUtils from '../utils/math.js';

export default class RenderSettingsModel {
	constructor(
		seed = RenderSettingsModel.getRandomSeed(),
		time = RenderSettingsModel.getRandomTime(),
		variance = RenderSettingsModel.getRandomVariance(),
	) {
		this.seed = seed;
		this.time = time;
		this.variance = variance;
	}

	static get SEED_MIN() {
		return 0;
	}

	static get SEED_MAX() {
		return Math.floor(0.5 * Number.MAX_SAFE_INTEGER);
	}

	static get TIME_MIN() {
		return -8;
	}

	static get TIME_MAX() {
		return 8;
	}

	static get TIME_PRECISION() {
		return 4;
	}

	static get VARIANCE_MIN() {
		return 0;
	}

	static get VARIANCE_MAX() {
		return 2048;
	}

	randomize() {
		this.seed = RenderSettingsModel.getRandomSeed();
		this.time = RenderSettingsModel.getRandomTime();
		this.variance = RenderSettingsModel.getRandomVariance();
	}

	toString() {
		return `${this.seed}|${this.time}|${this.variance}`;
	}

	static getRandomSeed() {
		return Math.floor(MathUtils.lerp(
			RenderSettingsModel.SEED_MIN,
			RenderSettingsModel.SEED_MAX,
			Math.random()
		));
	}

	static getRandomTime() {
		const multiplier = Math.pow(10, RenderSettingsModel.TIME_PRECISION);
		const value = MathUtils.lerp(
			RenderSettingsModel.TIME_MIN,
			RenderSettingsModel.TIME_MAX,
			Math.random()
		);

		return Math.floor(value * multiplier) / multiplier;
	}

	static getRandomVariance() {
		return Math.floor(MathUtils.lerp(
			RenderSettingsModel.VARIANCE_MIN,
			RenderSettingsModel.VARIANCE_MAX,
			Math.random()
		));
	}

	static parse(string) {
		const [
			seedString,
			timeString,
			varianceString,
		] = string.split(/\|/g);

		const seed = Number.parseInt(seedString);
		const time = Number.parseFloat(timeString);
		const variance = Number.parseInt(varianceString);

		return (!Number.isNaN(seed) && !Number.isNaN(time) && !Number.isNaN(variance))
			? new RenderSettingsModel(seed, time, variance)
			: null;
	}
}
