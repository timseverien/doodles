import App from './components/app.js';

const settingsConverter = {
	parse(string) {
		const [
			seed,
			time,
			variance,
		] = JSON.parse(`[${string}]`);

		return { seed, time, variance };
	},

	stringify(settings) {
		return JSON.stringify([
			settings.seed,
			settings.time,
			settings.variance,
		]).replace(/^\[|\]$/g, '');
	}
};

const app = new App(document.querySelector('[data-component="app"]'));

app.on('start', () => {
	const settings = settingsConverter.stringify({
		seed: app.formRendering.seed,
		time: app.formRendering.time,
		variance: app.formRendering.variance,
	});

	window.history.pushState(null, document.title, `#${settings}`);
});

if (window.location.hash) {
	app.setSettings(settingsConverter.parse(window.location.hash.substr(1)));
}

app.start();

window.addEventListener('hashchange', () => {
	app.setSettings(settingsConverter.parse(window.location.hash.substr(1)));
});

window.addEventListener('beforeunload', () => app.dispose());
