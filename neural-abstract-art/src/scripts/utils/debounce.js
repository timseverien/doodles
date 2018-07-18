export default (fn, delay = 100) => {
	let timeout;

	return () => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => fn(), delay);
	};
};
