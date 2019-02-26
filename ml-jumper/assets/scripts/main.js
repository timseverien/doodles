import JANNModel from './models/jann.js'
import Game from './game.js';

const game = new Game();
const model = new JANNModel();
const player = game.jumper;

document.body.appendChild(game.canvas);

const update = () => {
	requestAnimationFrame(update);
	game.render();
};

(async () => {
	while (true) {
		const x = tf.tensor(game.getState());
		const state = tf.tensor(game.getState());

		await model.predict(state);

		const y = tf.tensor([0, 1]);

		await model.fit(x, y);

		state.dispose();
		x.dispose();
		y.dispose();
	}
})();
