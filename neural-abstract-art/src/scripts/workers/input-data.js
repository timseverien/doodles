import MathUtils from '../utils/math';

const getReturnValue = [
	(xNormalized) => xNormalized,
	(xNormalized, yNormalized) => yNormalized,
	(xNormalized, yNormalized) => Math.sqrt(xNormalized * xNormalized + yNormalized * yNormalized),
	(xNormalized, yNormalized, time) => time,
];

self.addEventListener('message', (e) => {
	const { height, xOffset, yOffset, size, time, width } = e.data.message;
	const aspect = width / height;

	const data = new Float32Array(size * size * 4).fill(0).map((_, index) => {
		const pixelIndex = Math.round(index / 4);
		const x = xOffset + (pixelIndex % size);
		const y = yOffset + Math.floor(pixelIndex / size);
		const xNormalized = MathUtils.lerp(-1, 1, x / (width - 1)) * aspect;
		const yNormalized = MathUtils.lerp(-1, 1, y / (height - 1));

		return getReturnValue[index % 4](xNormalized, yNormalized, time);
	});

	self.postMessage({
		id: e.data.id,
		message: {
			data,
			xOffset,
			yOffset,
		},
	});
});
