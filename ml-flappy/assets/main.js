import Population from '../../generic-genetics/lib/population.js';
import Organism from './organism.js';

const population = new Population({
	selectCount: 2,
	size: 3,

	createOrganism() {
		return new Organism();
	},

	createOrganismFromParents(a, b) {
		return Organism.fromParents(a, b);
	},
});

console.log(population.organisms.map((o) => {
	console.log(o.brain);

	return o.brain.getWeights().dataSync();
}));

population.organisms.brain.summary();

population.nextGeneration();

population.organisms.brain.summary();

population.organisms.forEach(o => tf.dispose(o.brain));
