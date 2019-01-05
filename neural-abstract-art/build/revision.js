const fs = require('fs-extra');
const glob = require('globby');
const path = require('path');
const rev = require('rev-file');
const escapeString = require('escape-string-regexp');

const pathToUrl = path => path.split(/\\/g).join('/');

const ARG_PATH_SOURCE = process.argv[2];
const ARG_PATH_DESTINATION = process.argv[3];
const ARG_PATH_MARKUP_SOURCE = process.argv[4];
const ARG_PATH_MARKUP_DESTINATION = process.argv[5];

const manifest = {};

(async () => {
	const files = await glob(path.join(ARG_PATH_SOURCE, '**/*'));
	const filesReplace = await glob(path.join(ARG_PATH_MARKUP_SOURCE, '**/*.html'));

	await fs.ensureDir(ARG_PATH_DESTINATION);
	await Promise.all(files.map(async (filePath) => {
		const filePathRelative = pathToUrl(path.relative(ARG_PATH_SOURCE, filePath));
		const filePathRelativeHashed = pathToUrl(path.relative(ARG_PATH_SOURCE, await rev(filePath)));
		const filePathHashed = path.join(ARG_PATH_DESTINATION, filePathRelativeHashed);

		manifest[filePathRelative] = filePathRelativeHashed;

		return fs.copy(filePath, filePathHashed);
	}));

	await Promise.all(filesReplace.map(async (filePath) => {
		const filePathRelative = path.relative(ARG_PATH_MARKUP_SOURCE, filePath);
		const filePathTarget = path.join(ARG_PATH_MARKUP_DESTINATION, filePathRelative);
		const markup = (await fs.readFile(filePath)).toString();

		return fs.writeFile(filePathTarget, Object.entries(manifest).reduce((markup, [file, fileHashed]) => {
			return markup.replace(new RegExp(escapeString(`[hash ${file}]`), 'g'), fileHashed);
		}, markup));
	}));
})();
