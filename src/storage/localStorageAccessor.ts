import {localJsonStorage} from '@/storage/JsonStorage';
import ERDiagramPlaygroundSerializableConfig from '@/config/ERDiagramPlaygroundSerializableConfig';
import outputFormats, {OutputFormat} from '@/common/outputFormats';
import pokemonSampleCode from '!!raw-loader!@/sample-erd-files/Pokemon.erd';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import erdiagramPlaygroundConfigManager, {LAST_CONFIG_VERSION} from '@/config/ERDiagramPlaygroundConfigManager';

const ItemKeys = {
	INPUT_CODE: 'inputCode',
	OUTPUT_FORMAT_ID: 'outputFormatId',
	CONFIG: 'erdiagramConfig'
};

export interface LocalStorageAccessor {

	getInputCode(): string;

	setInputCode(inputCode: string): void;

	getOutputFormat(): OutputFormat;

	setOutputFormat(outputFormat: OutputFormat): void;

	getConfig(): ERDiagramPlaygroundConfig;

	setConfig(config: ERDiagramPlaygroundConfig): void;

}

const localStorageAccessor: LocalStorageAccessor = {

	getInputCode() {
		return localStorage.getItem(ItemKeys.INPUT_CODE) || pokemonSampleCode;
	},

	setInputCode(value) {
		localStorage.setItem(ItemKeys.INPUT_CODE, value);
	},

	getOutputFormat() {
		const outputFormatId = localStorage.getItem(ItemKeys.OUTPUT_FORMAT_ID);
		return outputFormatId != null && outputFormats[outputFormatId] || outputFormats.mysql;
	},

	setOutputFormat(value) {
		localStorage.setItem(ItemKeys.OUTPUT_FORMAT_ID, value.id);
	},

	getConfig() {

		const serializableConfig = localJsonStorage.getItem<ERDiagramPlaygroundSerializableConfig>(ItemKeys.CONFIG);

		if (serializableConfig) {

			// Check you are using the last version of the config
			if (serializableConfig._version === LAST_CONFIG_VERSION) {
				return erdiagramPlaygroundConfigManager.convertFromSerializableObject(serializableConfig);
			}

		}

		console.warn('Detected old version of settings: using default settings.');

		return erdiagramPlaygroundConfigManager.getDefaultConfig();

	},

	setConfig(value) {
		if (value == null) {
			localJsonStorage.removeItem(ItemKeys.CONFIG);
		} else {
			const serializableConfig = erdiagramPlaygroundConfigManager.convertToSerializableObject(value);
			localJsonStorage.setItem(ItemKeys.CONFIG, serializableConfig);
		}
	}

};

export default localStorageAccessor;
