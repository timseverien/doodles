import RenderSettingsModel from '../models/render-settings.js';
import EventEmitter from '../utils/event-emitter.js';

class RenderSettingsRepository extends EventEmitter {
	constructor() {
		super();

		window.addEventListener('hashchange', () => this.trigger('change'));
	}

	getRenderSettings() {
		if (!window.location.hash) {
			return null;
		}

		return RenderSettingsModel.parse(window.location.hash.substr(1));
	}

	persist(renderSettings) {
		if (!(renderSettings instanceof RenderSettingsModel)) {
			throw new Error(`"${renderSettings}" should be of type RenderSettingsModel`);
		}

		window.location.hash = renderSettings.toString();
	}
}

export default new RenderSettingsRepository();
