import {
	AbstractComponentConfigManager,
	classModelGeneratorConfigManager,
	databaseModelGeneratorConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelToCodeConverterConfigManager,
	mysqlDatabaseModelToCodeConverterConfigManager,
	oracleDatabaseModelToCodeConverterConfigManager,
	sqlServerDatabaseModelToCodeConverterConfigManager,
	typescriptClassModelToCodeConverterConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import ERDiagramPlaygroundSerializableConfig from '@/config/ERDiagramPlaygroundSerializableConfig';
import PartialERDiagramPlaygroundConfig from '@/config/PartialERDiagramPlaygroundConfig';

export const LAST_CONFIG_VERSION = '0.1.0-alpha.1';

export class ERDiagramPlaygroundConfigManager
		extends AbstractComponentConfigManager<ERDiagramPlaygroundConfig, PartialERDiagramPlaygroundConfig, ERDiagramPlaygroundSerializableConfig> {

	getDefaultConfig(): ERDiagramPlaygroundConfig {
		return {
			_version: LAST_CONFIG_VERSION,
			erModelParser: entityRelationshipModelParserConfigManager.getDefaultConfig(),
			mysql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				databaseModelToCodeConverterConfig: mysqlDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				databaseModelToCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
			},
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				databaseModelToCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.getDefaultConfig(),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.getDefaultConfig()
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.getDefaultConfig(),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.getDefaultConfig()
			}
		};
	}

	mergeConfigs(fullConfig: ERDiagramPlaygroundConfig, partialConfig?: PartialERDiagramPlaygroundConfig): ERDiagramPlaygroundConfig {
		return {
			_version: fullConfig._version,
			erModelParser: entityRelationshipModelParserConfigManager.mergeConfigs(
					fullConfig.erModelParser,
					partialConfig?.erModelParser
			),
			mysql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.mysql.databaseModelGeneratorConfig,
						partialConfig?.mysql?.databaseModelGeneratorConfig
				),
				databaseModelToCodeConverterConfig: mysqlDatabaseModelToCodeConverterConfigManager.mergeConfigs(
						fullConfig.mysql.databaseModelToCodeConverterConfig,
						partialConfig?.mysql?.databaseModelToCodeConverterConfig
				)
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.sqlserver.databaseModelGeneratorConfig,
						partialConfig?.sqlserver?.databaseModelGeneratorConfig
				),
				databaseModelToCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.mergeConfigs(
						fullConfig.sqlserver.databaseModelToCodeConverterConfig,
						partialConfig?.sqlserver?.databaseModelToCodeConverterConfig
				),
			},
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.oracle.databaseModelGeneratorConfig,
						partialConfig?.oracle?.databaseModelGeneratorConfig
				),
				databaseModelToCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.mergeConfigs(
						fullConfig.oracle.databaseModelToCodeConverterConfig,
						partialConfig?.oracle?.databaseModelToCodeConverterConfig
				),
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.mergeConfigs(
						fullConfig.java.classModelGeneratorConfig,
						partialConfig?.java?.classModelGeneratorConfig
				),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.mergeConfigs(
						fullConfig.java.classModelToCodeConverterConfig,
						partialConfig?.java?.classModelToCodeConverterConfig
				)
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.mergeConfigs(
						fullConfig.typescript.classModelGeneratorConfig,
						partialConfig?.typescript?.classModelGeneratorConfig
				),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.mergeConfigs(
						fullConfig.typescript.classModelToCodeConverterConfig,
						partialConfig?.typescript?.classModelToCodeConverterConfig
				)
			}
		};
	}

	convertToSerializableObject(fullConfig: ERDiagramPlaygroundConfig): ERDiagramPlaygroundSerializableConfig {
		return {
			_version: fullConfig._version,
			erModelParser: entityRelationshipModelParserConfigManager.convertToSerializableObject(fullConfig.erModelParser),
			mysql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.mysql.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: mysqlDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.mysql.databaseModelToCodeConverterConfig)
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.sqlserver.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.sqlserver.databaseModelToCodeConverterConfig),
			},
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.oracle.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.oracle.databaseModelToCodeConverterConfig),
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertToSerializableObject(fullConfig.java.classModelGeneratorConfig),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.java.classModelToCodeConverterConfig)
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertToSerializableObject(fullConfig.typescript.classModelGeneratorConfig),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.typescript.classModelToCodeConverterConfig)
			}
		};
	}

	convertFromSerializableObject(serializableConfig: ERDiagramPlaygroundSerializableConfig): ERDiagramPlaygroundConfig {
		return {
			_version: serializableConfig._version,
			erModelParser: entityRelationshipModelParserConfigManager.convertFromSerializableObject(serializableConfig.erModelParser),
			mysql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.mysql.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: mysqlDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.mysql.databaseModelToCodeConverterConfig)
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.sqlserver.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.sqlserver.databaseModelToCodeConverterConfig),
			},
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.oracle.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.oracle.databaseModelToCodeConverterConfig),
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.java.classModelGeneratorConfig),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.java.classModelToCodeConverterConfig)
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.typescript.classModelGeneratorConfig),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.typescript.classModelToCodeConverterConfig)
			}
		};
	}

}

const erdiagramPlaygroundConfigManager = new ERDiagramPlaygroundConfigManager();
export default erdiagramPlaygroundConfigManager;
