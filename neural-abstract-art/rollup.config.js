import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [{
	input: 'src/scripts/main.js',
	plugins: [
		babel(),
		uglify(),
	],

	output: {
		file: 'dist/assets/main.js',
		format: 'iife',
	},
}, {
	input: 'src/scripts/workers/input-data.js',
	plugins: [
		babel(),
		uglify(),
	],

	output: {
		file: 'assets/workers/input-data.js',
		format: 'esm',
	},
}];
