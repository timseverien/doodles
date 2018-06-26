import ReferenceMap from './utils/reference-map.js';
import App from './app.js';

const $refs = new ReferenceMap(document.body);
$refs.get('input-seed').max = 0.1 * Number.MAX_SAFE_INTEGER;

const app = new App($refs);
app.start();

window.addEventListener('beforeunload', () => app.stop());
