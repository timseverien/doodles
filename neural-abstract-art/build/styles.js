const fs = require('fs-extra');
const glob = require('globby');
const path = require('path');

const ARG_PATH_SOURCE = process.argv[2];
const ARG_PATH_DESTINATION = process.argv[3];

(async () => {
	const files = await glob(path.join(ARG_PATH_SOURCE, '**/*.css'));

	await fs.ensureDir(ARG_PATH_DESTINATION);

	await Promise.all(files.map((filePath) => {
		const filePathRelative = path.relative(ARG_PATH_SOURCE, filePath);
		const filePathTarget = path.join(ARG_PATH_DESTINATION, filePathRelative);

		return fs.copy(filePath, filePathTarget);
	}));
})();
