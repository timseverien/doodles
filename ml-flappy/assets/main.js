import Population from '../../generic-genetics/lib/population.js';
import BirdModel from './models/bird.js';
import BrainModel from './models/brain.js';

const population = new Population({
	selectCount: 2,
	size: 3,

	createOrganism() {
		return new BirdModel();
	},

	createOrganismFromParents(a, b) {
		const brain = BrainModel.fromParents(a.brain, b.brain);

		return new BirdModel(brain);
	},
});

population.organisms.forEach(o => o.update());
population.nextGeneration();
population.organisms.forEach(o => o.update());

population.dispose();

window.addEventListener('beforeunload', () => population.dispose());
