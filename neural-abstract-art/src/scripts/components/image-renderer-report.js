import BaseComponent from './base.js';
import formatDuration from '../utils/format-duration.js';

export default class ImageRendererReportComponent extends BaseComponent {
	constructor(element) {
		super(element);

		this.elementProgress = this.getElement('report-progress');
		this.elementTimeRemaining = this.getElement('report-time-remaining');
		this.timePrevious = 0;
	}

	start() {
		this.timeElapsed = 0;
		this.timePrevious = performance.now();

		this.update(0);
	}

	update(progress) {
		const now = performance.now();
		const delta = (now - this.timePrevious) / 1000;
		this.timeElapsed += delta;

		const timeTotal = progress > 0
			? (1 / progress) * this.timeElapsed
			: Infinity;

		const timeRemaining = (1 - progress) * timeTotal;

		this.elementProgress.innerText = `${(100 * progress).toFixed(2)}%`;
		this.elementTimeRemaining.innerText = `~${formatDuration(timeRemaining)} remaining`;

		this.timePrevious = now;
	}
}
