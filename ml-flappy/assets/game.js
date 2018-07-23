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

		this._population.organisms.forEach((organism) => {
			organism.velocity.y += 0.2;
			organism.update();
			organism.render(this._context);
		});
	}

	_restart() {
		this.stop(() => {
			this._population.nextGeneration();
			this.start();
		});
	}
}
