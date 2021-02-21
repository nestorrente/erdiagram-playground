import {localJsonStorage} from '@/storage/JsonStorage';
import ERDiagramPlaygroundSerializableConfig from '@/config/ERDiagramPlaygroundSerializableConfig';

const ItemKeys = {
	INPUT_CODE: 'inputCode',
	CONFIG: 'erdiagramConfig'
};

export interface LocalStorageAccessor {

	getInputCode(): string | null;

	setInputCode(inputCode: string): void;

	getConfig(): ERDiagramPlaygroundSerializableConfig | null;

	setConfig(config: ERDiagramPlaygroundSerializableConfig): void;

}

const localStorageAccessor: LocalStorageAccessor = {

	getInputCode() {
		return localStorage.getItem(ItemKeys.INPUT_CODE);
	},

	setInputCode(value) {
		localStorage.setItem(ItemKeys.INPUT_CODE, value);
	},

	getConfig() {
		return localJsonStorage.getItem(ItemKeys.CONFIG);
	},

	setConfig(value) {
		if (value == null) {
			localJsonStorage.removeItem(ItemKeys.CONFIG);
		} else {
			localJsonStorage.setItem(ItemKeys.CONFIG, value);
		}
	}

};

export default localStorageAccessor;
