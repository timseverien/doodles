import App from './components/app.js';

const settingsConverter = {
	parse(string) {
		const [
			width,
			height,
			seed,
			time,
			variance,
		] = JSON.parse(string);

		return { width, height, seed, time, variance };
	},

	stringify(settings) {
		return JSON.stringify([
			settings.width,
			settings.height,
			settings.seed,
			settings.time,
			settings.variance,
		]);
	}
};

const app = new App(document.querySelector('[data-component="app"]'));

app.on('start', () => {
	const settings = settingsConverter.stringify({
		height: app.imageSettings.height,
		width: app.imageSettings.width,

		seed: app.renderSettings.seed,
		time: app.renderSettings.time,
		variance: app.renderSettings.variance,
	});

	window.history.pushState(null, document.title, `#${settings}`);
});

if (window.location.hash) {
	app.setSettings(settingsConverter.parse(window.location.hash.substr(1)));
}

app.start();

window.addEventListener('beforeunload', () => app.dispose());
