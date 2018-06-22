const ArrayUtils = {
	shuffle(arr) {
		const copy = Array.from(arr);

		for (let i = copy.length - 1; i >= 1; i--) {
			const j = Math.floor(copy.length * Math.random());
			const tmp = copy[i];

			copy[i] = copy[j];
			copy[j] = tmp;
		}

		return copy;
	},
};

export default class Population {
	constructor({ createOrganism, createOrganismFromParents, selectCount, size }) {
		if (typeof createOrganism !== 'function') {
			throw new Error('options.createOrganism is not a function');
		}
		if (typeof createOrganismFromParents !== 'function') {
			throw new Error('options.createOrganismFromParents is not a function');
		}
		if (!Number.isInteger(selectCount)) {
			throw new Error('options.selectCount is not an integer');
		}
		if (!Number.isInteger(size) || size < 3) {
			throw new Error('options.size is not an integer ≥ 3');
		}
		if (selectCount >= size) {
			throw new Error('options.selectCount should be less than options.size');
		}

		this._createOrganism = createOrganism;
		this._createOrganismFromParents = createOrganismFromParents;
		this._selectCount = selectCount;
		this._size = size;

		this.organisms = new Array(this._size).fill().map(() => {
			const organism = this._createOrganism();

			if (typeof organism.getScore !== 'function') {
				throw new Error('Organisms should implement the getScore() method');
			}

			return organism;
		});
	}

	nextGeneration() {
		const selection = Array.from(this.organisms)
			.sort((a, b) => b.getScore() - a.getScore())
			.slice(0, this._selectCount);

		this.organisms = new Array(this._size).fill()
			.map(() => this._createOrganismFromParents(...ArrayUtils.shuffle(selection).splice(0, 2)));
	}
}
