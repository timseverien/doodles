import App from './components/app.js';

const app = new App(document.querySelector('[data-component="app"]'));

window.addEventListener('beforeunload', () => app.dispose());
