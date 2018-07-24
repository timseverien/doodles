import AnimationLoop from './utils/animation-loop.js';

export default class Game {
	constructor(canvas, population) {
		this._animationLoop = new AnimationLoop(frame => this._render(frame));
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		this._obstacles = [];
		this._population = population;
	}

	start() {
		this._animationLoop.start();
	}

	stop(callback) {
		this._animationLoop.stop(callback);
	}

	_render() {
		if (this._population.organisms.some(organism => organism.isAlive)) {
			this._restart();
			return;
		}

		const { height, width } = this._canvas;

		this._context.save();
		this._context.clearRect(0, 0, width, height);
		this._context.translate(10, 0);

		this._population.organisms.forEach((organism) => {
			organism.velocity.y += Game.WORLD_GRAVITY;
			organism.update();
			organism.render(this._context);

			if (organism.position.y > height) {
				organism.kill();
			}
		});

		this._context.restore();
	}

	_restart() {
		this.stop(() => {
			this._population.nextGeneration();
			this.start();
		});
	}

	static get WORLD_GRAVITY() {
		return 0.2;
	}
}
