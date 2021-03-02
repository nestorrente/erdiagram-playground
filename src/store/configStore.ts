import {createStore} from '@/store/util/createStore';
import {ref, watch} from 'vue';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import localStorageAccessor from '@/storage/localStorageAccessor';

const configStore = createStore(() => {

	const config = ref(localStorageAccessor.getConfig());
	watch(config, newValue => localStorageAccessor.setConfig(newValue));

	return {
		config,
		updateConfig(newConfig: ERDiagramPlaygroundConfig) {
			return config.value = newConfig;
		}
	};

});

export default configStore;
