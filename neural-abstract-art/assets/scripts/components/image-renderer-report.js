import BaseComponent from './base.js';
import formatDuration from '../utils/format-duration.js';

export default class ImageRendererReportComponent extends BaseComponent {
	constructor(element) {
		super(element);

		// this.imageRenderer = imageRenderer;

		// this.elementProgress = this.getElement('report-progress');
		// this.elementTimeRemaining = this.getElement('report-time-remaining');

		// this.imageRenderer.on('render', (progress) => this.update(progress));
		// this.imageRenderer.on('start', () => this.start());

		// this.start();
	}

	// start() {
	// 	this.timeElapsed = 0;
	// 	this.timePrevious = performance.now();
	// 	this.update(0);
	// }

	// update(progress) {
	// 	const now = performance.now();
	// 	const delta = (now - this.timePrevious) / 1000;
	// 	this.timeElapsed += delta;

	// 	const timeTotal = (1 / progress) * this.timeElapsed;
	// 	const timeRemaining = (1 - progress) * timeTotal;

	// 	this.elementProgress.innerText = `${(100 * progress).toFixed(2)}%`;
	// 	this.elementTimeRemaining.innerText = `~${formatDuration(timeRemaining)} remaining`;

	// 	this.timePrevious = now;
	// }
}
