import {localJsonStorage} from '@/storage/JsonStorage';
import outputFormats, {OutputFormat} from '@/common/output/outputFormats';
import pokemonSampleCode from '@/sample-erd-files/Pokemon.erd?raw';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import erdiagramPlaygroundConfigManager from '@/config/ERDiagramPlaygroundConfigManager';
import type {JsonObject} from 'true-json';
import configCompatibilityManager from '@/config/ERDiagramPlaygroundConfigCompatibilityAdapter';
import {APP_VERSION} from "@/AppInfo.ts";

const ItemKeys = {
	INPUT_CODE: 'inputCode',
	OUTPUT_FORMAT_ID: 'outputFormatId',
	CONFIG: 'erdiagramConfig',
	VERTICAL_SPLIT_PANEL_LEFT_COLUMN_WIDTH_PERCENT: 'verticalSplitPanelLeftColumnWidthPercent'
};

export default {

	getInputCode(): string {
		return localStorage.getItem(ItemKeys.INPUT_CODE) || pokemonSampleCode;
	},

	setInputCode(value: string): void {
		localStorage.setItem(ItemKeys.INPUT_CODE, value);
	},

	getOutputFormat(): OutputFormat {
		const outputFormatId = localStorage.getItem(ItemKeys.OUTPUT_FORMAT_ID);
		return outputFormatId != null && outputFormats[outputFormatId] || outputFormats.mysql;
	},

	setOutputFormat(value: OutputFormat): void {
		localStorage.setItem(ItemKeys.OUTPUT_FORMAT_ID, value.id);
	},

	getConfig(): ERDiagramPlaygroundConfig {

		const serializableConfig = localJsonStorage.getItem<JsonObject>(ItemKeys.CONFIG);

		if (serializableConfig) {

			const adaptedSerializableConfig = configCompatibilityManager.adaptIfPossible(serializableConfig);

			// Check you are using the last version of the config
			if (adaptedSerializableConfig._version === APP_VERSION) {
				return erdiagramPlaygroundConfigManager.convertFromSerializableObject(adaptedSerializableConfig);
			}

			console.warn('Detected old version of settings: using default settings.');

		}

		return erdiagramPlaygroundConfigManager.getDefaultConfig();

	},

	setConfig(value: ERDiagramPlaygroundConfig): void {
		if (value == null) {
			localJsonStorage.removeItem(ItemKeys.CONFIG);
		} else {
			const serializableConfig = erdiagramPlaygroundConfigManager.convertToSerializableObject(value);
			localJsonStorage.setItem(ItemKeys.CONFIG, serializableConfig);
		}
	},

	getVerticalSplitPanelLeftColumnWidthPercent(): number {
		const value = localStorage.getItem(ItemKeys.VERTICAL_SPLIT_PANEL_LEFT_COLUMN_WIDTH_PERCENT);
		return value ? parseFloat(value) : 50;
	},

	setVerticalSplitPanelLeftColumnWidthPercent(value: number): void {
		localStorage.setItem(ItemKeys.VERTICAL_SPLIT_PANEL_LEFT_COLUMN_WIDTH_PERCENT, String(value));
	}

};
