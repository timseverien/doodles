import RenderSettingsModel from '../models/render-settings.js';
import EventEmitter from '../utils/event-emitter.js';

class RenderSettingsRepository extends EventEmitter {
	constructor() {
		super();
		this.currentHash = window.location.hash;
                window.addEventListener('hashchange', () => {
                    if(window.location.hash.substr(1) != this.currentHash){
                        this.trigger('change');
                    }
                });
        }

        updateHash(newHash){
                this.currentHash = newHash;
        	window.location.hash = this.currentHash;
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
		this.updateHash(renderSettings.toString());
	}
}

export default new RenderSettingsRepository();
