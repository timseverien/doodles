import test from 'ava';
import Population from './population';

const createOrganism = () => ({
	getScore() {
		return Math.random();
	},
});

const createOrganismFromParents = () => createOrganism();

test('Population.constructor', (t) => {
	t.throws(() => new Population(null));
	t.throws(() => new Population(123));
	t.throws(() => new Population('123'));
	t.throws(() => new Population([]));

	t.notThrows(() => new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: 2,
		size: 3,
	}));

	const population = new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: 2,
		size: 3,
	});

	t.is(population._organisms.length, 3);
});

test('Population.constructor with invalid "createOrganism" option', (t) => {
	t.throws(() => new Population({
		createOrganism: null,
		createOrganismFromParents,
		selectCount: 2,
		size: 3,
	}));

	t.throws(() => new Population({
		createOrganism: 123,
		createOrganismFromParents,
		selectCount: 2,
		size: 3,
	}));
});

test('Population.constructor with invalid "createOrganismFromParents" option', (t) => {
	t.throws(() => new Population({
		createOrganism,
		createOrganismFromParents: null,
		selectCount: 2,
		size: 3,
	}));

	t.throws(() => new Population({
		createOrganism,
		createOrganismFromParents: 123,
		selectCount: 2,
		size: 3,
	}));
});

test('Population.constructor with invalid "selectCount" option', (t) => {
	t.throws(() => new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: null,
		size: 3,
	}));

	t.throws(() => new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: '2',
		size: 3,
	}));

	t.throws(() => new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: 2.5,
		size: 3,
	}));
});

test('Population.constructor with invalid "size" option', (t) => {
	t.throws(() => new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: 2,
		size: null,
	}));

	t.throws(() => new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: 2,
		size: '3',
	}));

	t.throws(() => new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: 2,
		size: 3.5,
	}));
});


test('Population.nextGeneration', (t) => {
	const population = new Population({
		createOrganism,
		createOrganismFromParents,
		selectCount: 2,
		size: 3,
	});

	population.nextGeneration();

	t.is(population._organisms.length, 3);
});
