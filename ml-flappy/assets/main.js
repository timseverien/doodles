import Population from '../../generic-genetics/lib/population.js';
import BirdObject from './objects/bird.js';
import Game from './game.js';

const population = new Population({
	selectCount: 2,
	size: 3,

	createOrganism() {
		return new BirdObject();
	},

	createOrganismFromParents(a, b) {
		const brain = BrainModel.fromParents(a.brain, b.brain);

		return new BirdObject(brain);
	},
});

const canvas = document.createElement('canvas');
canvas.height = 256;
canvas.width = 512;
document.body.appendChild(canvas);

const game = new Game(canvas, population);
game.start();

window.addEventListener('beforeunload', () => {
	game.stop(() => population.dispose());
});
