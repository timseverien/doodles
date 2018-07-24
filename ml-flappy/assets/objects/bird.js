import BrainModel from '../models/brain.js';
import GameObject from './game-object.js';

export default class BirdObject extends GameObject {
	constructor(brain) {
		super();

		this.brain = brain instanceof BrainModel ? brain : new BrainModel();

		this._isAlive = true;
		this._score = 0;
	}

	getScore() {
		return this._score;
	}

	kill() {
		this._isAlive = false;
	}

	render(context) {
		context.beginPath();
		context.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI);
		context.fill();
	}

	update() {
		if (!this._isAlive) return;

		const [boost] = tf.tidy(() => this.brain
			.predict(tf.ones([1, 4]))
			.dataSync());

		if (boost >= 1) {
			// this.velocity.y = -1;
		}

		super.update();

		// this._isAlive = false;
		this._score++;
	}
}
