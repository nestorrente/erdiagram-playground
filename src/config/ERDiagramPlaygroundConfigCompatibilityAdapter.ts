import type {JsonObject} from 'true-json';
import {APP_VERSION} from '@/AppInfo.ts';
import {
	ERDiagramPlaygroundConfigVersionM1M0P0,
	ERDiagramPlaygroundConfigVersionM1M1P0
} from '@/config/ERDiagramPlaygroundConfigCompatibleVersions.ts';
import {
	jpaConfigManager,
	lombokConfigManager
} from '@nestorrente/erdiagram';

const CONFIG_VERSION_M1M0P0: ERDiagramPlaygroundConfigVersionM1M0P0['_version'] = '1.0.0-1673646135755';
const CONFIG_VERSION_M1M1P0: ERDiagramPlaygroundConfigVersionM1M0P0['_version'] = '1.1.0';

export class ERDiagramPlaygroundConfigCompatibilityAdapter {

    public adaptIfPossible(serializableConfig: JsonObject): JsonObject {

        if (isLatestConfigVersion(serializableConfig)) {
            // Latest version - Nothing to adapt
            return serializableConfig;
        }

        if (isConfigVersionM1M1P0(serializableConfig)) {

            console.info('Compatible settings version found: adapting to new format');

            return {
                ...serializableConfig,
                _version: APP_VERSION,
                java: {
                    ...serializableConfig.java,
					classModel: {
						...serializableConfig.java.classModel,
						enforceNotNullLists: false
					},
                    transformers: {
                        ...serializableConfig.java.transformers,
						shared: {
							javaExtendedPackage: jpaConfigManager.getDefaultConfig().javaExtendedPackage
						},
						lombok: lombokConfigManager.convertToSerializableObject(
								lombokConfigManager.getDefaultConfig()
						)
                    }
                },
				typescript: {
					...serializableConfig.typescript,
					classModel: {
						...serializableConfig.typescript.classModel,
						enforceNotNullLists: false
					},
				}
            };

        }

        if (isConfigVersionM1M0P0(serializableConfig)) {

            console.info('Compatible settings version found: adapting to new format');

            return {
                ...serializableConfig,
                _version: APP_VERSION,
                java: {
                    ...serializableConfig.java,
					classModel: {
						...serializableConfig.java.classModel,
						enforceNotNullLists: false
					},
                    transformers: {
                        ...serializableConfig.java.transformers,
                        lombok: lombokConfigManager.convertToSerializableObject(
                            lombokConfigManager.getDefaultConfig()
                        )
                    }
                },
				typescript: {
					...serializableConfig.typescript,
					classModel: {
						...serializableConfig.typescript.classModel,
						enforceNotNullLists: false
					},
				}
            };

        }

        // Incompatible version - nothing to adapt, caller function must handle it
        return serializableConfig;

    }

}

function isLatestConfigVersion(serializableConfig: JsonObject) {
    return serializableConfig._version === APP_VERSION;
}

// This type-guard is not really true, as serializableConfig is the config object serialized by TrueJSON.
// However, it's good enough for compatibility-adaptation purposes.
function isConfigVersionM1M0P0(serializableConfig: JsonObject): serializableConfig is ERDiagramPlaygroundConfigVersionM1M0P0 {
    return serializableConfig._version === CONFIG_VERSION_M1M0P0;
}

// This type-guard is not really true, as serializableConfig is the config object serialized by TrueJSON.
// However, it's good enough for compatibility-adaptation purposes.
function isConfigVersionM1M1P0(serializableConfig: JsonObject): serializableConfig is ERDiagramPlaygroundConfigVersionM1M1P0 {
    return serializableConfig._version === CONFIG_VERSION_M1M1P0;
}

const configCompatibilityManager = new ERDiagramPlaygroundConfigCompatibilityAdapter();
export default configCompatibilityManager;
