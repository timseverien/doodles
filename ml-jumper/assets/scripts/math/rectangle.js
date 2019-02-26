export default class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
	}

	get bottom() {
		return this.y + this.height;
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + this.width;
	}

	get top() {
		return this.y;
	}
}
