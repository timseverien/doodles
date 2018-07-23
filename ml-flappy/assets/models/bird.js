import BrainModel from './brain.js';

export default class BirdModel {
	constructor(brain) {
		this.brain = brain instanceof BrainModel ? brain : new BrainModel();
	}

	getScore() {
		return Math.random();
	}

	update() {
		tf.tidy(() => {
			const boost = this.brain.predict(tf.ones([null, 4]));

			console.log(boost);
		});
	}
}
