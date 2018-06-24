export default (fn, rendersPerFrame = 1) => {
	let frame = 0;
	let stopLoop = false;

	const stop = () => {
		stopLoop = true;
	};

	const update = (time) => {
		if (stopLoop) return;

		requestAnimationFrame(update);

		for (let i = 0; i < rendersPerFrame; i++) {
			const isLast = i === rendersPerFrame - 1;

			fn(time, frame++, isLast, stop);

			if (frame >= Number.MAX_SAFE_INTEGER) {
				frame = 0;
			}
		}
	};

	update(performance.now());
};
