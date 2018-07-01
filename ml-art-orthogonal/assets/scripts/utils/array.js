export default {
	chunk(arr, size) {
		if (
			!Array.isArray(arr) &&
			!(arr instanceof Int8Array) &&
			!(arr instanceof Uint8Array) &&
			!(arr instanceof Uint8ClampedArray) &&
			!(arr instanceof Int16Array) &&
			!(arr instanceof Uint16Array) &&
			!(arr instanceof Int32Array) &&
			!(arr instanceof Uint32Array) &&
			!(arr instanceof Float32Array) &&
			!(arr instanceof Float64Array)
		) {
			throw new Error(`"${arr}" is not an Array`);
		}
		if (!Number.isInteger(size)) {
			throw new Error(`"${size} is not an Integer"`);
		}

		return arr.reduce((result, item, index) => {
			const resultIndex = Math.floor(index / size);

			if (result.length <= resultIndex) {
				result.push([]);
			}

			result[resultIndex].push(item);

			return result;
		}, []);
	}
};
