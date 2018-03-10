module.exports = class Color {
	get red() {
		return (this.value >> 16) & 0xFF;
	}
	get green() {
		return (this.value >> 8) & 0xFF;
	}
	get blue() {
		return this.value & 0xFF;
	}
	get rgb() {
		return [
			this.red,
			this.green,
			this.blue,
		];
	}

	constructor(value) {
		this.value = value;
	}

	toString() {
		return this.value.toString(16).padStart(6, '0');
	}

	static random() {
		return new Color(Math.floor(Math.random() * (0xFFFFFF + 1)));
	}

	static getChannelLuminance(channelUint) {
		const channel = channelUint / 255;

		return channel <= 0.03928
			? channel / 12.92
			: Math.pow((channel + 0.055) / 1.055, 2.4);
	}

	static getContrastRatio(a, b) {
		return (
			(0.05 + Color.getLuminance(a)) /
			(0.05 + Color.getLuminance(b))
		);
	}

	static getLuminance(color) {
		return (
			0.2126 * Color.getChannelLuminance(color.red) +
			0.7152 * Color.getChannelLuminance(color.green) +
			0.0722 * Color.getChannelLuminance(color.blue)
		);
	}
};
