import BrainModel from '../models/brain.js';
import GameObject from './game-object.js';
import Box from '../models/box.js';
import Vector2 from '../math/vector2.js';

export default class BirdObject extends GameObject {
	constructor(position, brain) {
		super(position);

		this.brain = brain instanceof BrainModel ? brain : new BrainModel();
		this.isAlive = true;

		this._score = 0;
	}

	getBoundingBox() {
		return new Box(
			this.position,
			new Vector2(BirdObject.SIZE, BirdObject.SIZE)
		);
	}

	getScore() {
		return this._score;
	}

	kill() {
		this.isAlive = false;
	}

	render(context) {
		context.beginPath();
		context.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI);
		context.fill();
	}

	update() {
		if (!this.isAlive) return;

		const [boost] = tf.tidy(() => this.brain
			.predict(tf.ones([1, 4]))
			.dataSync());

		if (boost >= 1) {
			// this.velocity.y = -1;
		}

		super.update();

		this._score++;
	}

	static get SIZE() {
		return 4;
	}
}
