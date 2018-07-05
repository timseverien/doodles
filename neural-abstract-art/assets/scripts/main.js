import RenderSettingsRepository from './repositories/render-settings.js';
import App from './components/app.js';

const app = new App(document.querySelector('[data-component="app"]'));
app.start();

RenderSettingsRepository.on('change', () => app.restart());

window.addEventListener('beforeunload', () => app.stop());
