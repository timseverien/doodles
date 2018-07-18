export default class ImageSettings {
	constructor(width = 320, height = 320, renderSpeed = 0) {
		this.height = height;
		this.renderSpeed = renderSpeed;
		this.width = width;
	}

	setResolutionFromString(resolution) {
		const [width, height] = resolution
			.split(/x/g)
			.map(n => Number.parseInt(n));

		if (height && width) {
			this.height = height;
			this.width = width;
		}
	}
}
