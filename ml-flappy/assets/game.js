import AnimationLoop from './utils/animation-loop.js';
import FpsMeter from './utils/fps-meter.js';
import ObstacleObject from './objects/obstacle.js';
import Vector2 from './math/vector2.js';
import Box from './models/box.js';

export default class Game {
	constructor(canvas, population) {
		this._animationLoop = new AnimationLoop(frame => this._render(frame));
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		this._obstacles = [];
		this._population = population;
		this._fpsMeter = new FpsMeter();
	}

	start() {
		this._obstacles = new Array(1).fill().map((_, index, array) => {
			const x = index / array.length * (ObstacleObject.WIDTH + this._canvas.width);

			return new ObstacleObject(new Vector2(x, 0));
		});

		this._animationLoop.start();
	}

	stop(callback) {
		this._animationLoop.stop(callback);
	}

	_render() {
		if (!this._population.organisms.some(organism => organism.isAlive)) {
			this._restart();
			return;
		}

		const { height, width } = this._canvas;

		this._context.save();
		this._context.clearRect(0, 0, width, height);

		this._obstacles.forEach((obstacle) => {
			obstacle.update();

			if (obstacle.position.x < -ObstacleObject.WIDTH) {
				obstacle.position.x += width + ObstacleObject.WIDTH;
			}

			obstacle.render(this._context);
		});

		this._population.organisms.forEach((organism) => {
			if (!organism.isAlive) {
				organism.render(this._context);
				return;
			}

			const organismBox = organism.getBoundingBox();
			const isTouchingObstacle = this._obstacles.some((obstacle) => {
				const [boxA, boxB] = obstacle.getBoundingBoxes(this._context);

				return Box.overlap(organismBox, boxA) || Box.overlap(organismBox, boxB);
			});

			organism.velocity.y += Game.WORLD_GRAVITY;
			organism.update();
			organism.render(this._context);

			if (organism.position.y > height) {
				organism.kill();
			}
		});

		this._context.restore();
		this._fpsMeter.update();

		this._context.font = '16px monospace';
		this._context.textAlign = 'right';
		this._context.fillText(`FPS ${this._fpsMeter.fps}`, width, 20);

		const size = new Vector2(10, 10);

		console.log(Box.overlap(
			new Box(new Vector2(0, 0), size),
			new Box(new Vector2(0, 0), size),
		));

	}

	_restart() {
		this.stop(() => {
			this._population.nextGeneration();
			this.start();
		});
	}

	static get WORLD_GRAVITY() {
		return 0;
	}
}
