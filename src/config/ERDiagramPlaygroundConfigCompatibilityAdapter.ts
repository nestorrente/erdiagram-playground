import {JsonObject} from 'true-json';
import {COMPATIBLE_CONFIG_VERSION, LATEST_CONFIG_VERSION} from '@/config/ERDiagramPlaygroundConfigManager';
import {
    nomnomlConfigManager,
    NomnomlStyleConfig,
    plantUmlConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';

export class ERDiagramPlaygroundConfigCompatibilityAdapter {

    public adaptIfPossible(serializableConfig: JsonObject): JsonObject {

        if (serializableConfig._version !== COMPATIBLE_CONFIG_VERSION) {
            // Latest or incompatible version - nothing to adapt
            return serializableConfig;
        }

        console.info('Compatible settings version found: adapting to new format');

        return {
            ...(serializableConfig as Omit<ERDiagramPlaygroundConfig, 'nomnoml' | 'plantuml'>),
            _version: LATEST_CONFIG_VERSION,
            nomnoml: nomnomlConfigManager.mergeWithDefaultConfig({
                style: serializableConfig.nomnoml as NomnomlStyleConfig
            }),
            plantuml: plantUmlConfigManager.getDefaultConfig()
        };

    }

}

const configCompatibilityManager = new ERDiagramPlaygroundConfigCompatibilityAdapter();
export default configCompatibilityManager;
