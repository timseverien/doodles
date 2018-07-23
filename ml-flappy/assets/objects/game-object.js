import Vector2 from '../math/vector2.js';

export default class GameObject {
	constructor(position = new Vector2(), velocity = new Vector2()) {
		this.position = position;
		this.velocity = velocity;
	}

	update() {
		this.position.add(this.velocity);
	}
}
