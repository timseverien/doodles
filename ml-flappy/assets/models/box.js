export default class Box {
	constructor(position, size) {
		this.position = position;
		this.size = size;
	}

	get bottom() {
		return this.position.y + this.size.y;
	}

	get left() {
		return this.position.x;
	}

	get right() {
		return this.position.x + this.size.x;
	}

	get top() {
		return this.position.y;
	}

	get [Symbol.toStringTag]() {
		return `${this.left},${this.top} ${this.right},${this.bottom}`;
	}

	static overlap(a, b) {
		return !(
			a.right < b.left ||
			a.left > b.right ||
			a.top < b.bottom ||
			a.bottom > b.top
		);
	}
}
