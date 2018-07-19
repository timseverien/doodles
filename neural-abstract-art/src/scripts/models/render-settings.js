import MathUtils from '../utils/math.js';

export default class RenderSettingsModel {
	constructor(
		seed = RenderSettingsModel.getRandomSeed(),
		time = RenderSettingsModel.getRandomTime(),
		sharpness = RenderSettingsModel.getRandomSharpness(),
	) {
		this.seed = seed;
		this.time = time;
		this.sharpness = sharpness;
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

	static get SHARPNESS_MIN() {
		return 0;
	}

	static get SHARPNESS_MAX() {
		return Math.pow(2, 12);
	}

	randomize() {
		this.seed = RenderSettingsModel.getRandomSeed();
		this.time = RenderSettingsModel.getRandomTime();
		this.sharpness = RenderSettingsModel.getRandomSharpness();
	}

	toString() {
		return `${this.seed}|${this.time}|${this.sharpness}`;
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

	static getRandomSharpness() {
		return Math.floor(MathUtils.lerp(
			RenderSettingsModel.SHARPNESS_MIN,
			RenderSettingsModel.SHARPNESS_MAX,
			Math.random()
		));
	}

	static parse(string) {
		const [
			seedString,
			timeString,
			sharpnessString,
		] = string.split(/\|/g);

		const seed = Number.parseInt(seedString);
		const time = Number.parseFloat(timeString);
		const sharpness = Number.parseInt(sharpnessString);

		return (!Number.isNaN(seed) && !Number.isNaN(time) && !Number.isNaN(sharpness))
			? new RenderSettingsModel(seed, time, sharpness)
			: null;
	}
}
