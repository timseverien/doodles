export default {
	load(element, moduleName, constructor) {
		return Array
			.from(element.querySelectorAll(`[data-module="${moduleName}"]`))
			.map(element => new constructor(element));
	},

	loadOne(element, moduleName, constructor) {
		return this.load(element, moduleName, constructor).shift();
	},
};
