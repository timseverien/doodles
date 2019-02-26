// import Rectangle from './math/rectangle.js';
import Vector2 from './math/vector2.js';

class Obstacle {
	constructor(x) {
		this.position = new Vector2(x);
		this.size = new Vector2(16, 32);
		this.velocity = 0;

		this.score = 0;
	}

	update() {
		this.position.y = Math.max(0, this.position.y + this.velocity);
	}

	render(context) {
		const x = this.position.x - 0.5 * this.size.x;
		const y = this.position.y - this.size.y;

		context.fillRect(x, y, this.size.x, this.size.y);
	}
}

export default class Game {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.height = 256;
		this.canvas.width = 512;

		this.jumper = new Obstacle();
		this.obstacle = new Obstacle();
	}

	getState() {
		return [
			this.jumper.y,
			Math.abs(this.jumper.x - this.obstacle.x),
		];
	}

	render() {
		this.obstacle.y = this.canvas.width * Math.random();

		this.jumper.render(this.context);
		this.obstacle.render(this.context);
	}

	update() {
		const delta = 1 / 60;

		this.score += delta;

		this.jumper.update(delta);
	}
}
