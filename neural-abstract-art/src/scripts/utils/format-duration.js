const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * 60;

export default (duration) => {
	if (duration === Infinity) {
		return 'forever';
	}

	if (duration < SECONDS_PER_MINUTE) {
		return `${duration.toFixed(0)}s`;
	}

	if (duration < SECONDS_PER_HOUR) {
		return `${(duration / SECONDS_PER_MINUTE).toFixed(0)}m`;
	}

	return `${(duration / SECONDS_PER_HOUR).toFixed(2)}h`;
};
