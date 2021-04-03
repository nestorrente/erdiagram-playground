import {
	AbstractComponentConfigManager,
	classModelGeneratorConfigManager,
	databaseModelGeneratorConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelToCodeConverterConfigManager,
	mysqlDatabaseModelToCodeConverterConfigManager,
	nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager,
	oracleDatabaseModelToCodeConverterConfigManager,
	plantumlEntityRelationshipModelToDiagramCodeConverterConfigManager,
	postgresqlDatabaseModelToCodeConverterConfigManager,
	sqlServerDatabaseModelToCodeConverterConfigManager,
	typescriptClassModelToCodeConverterConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import ERDiagramPlaygroundSerializableConfig from '@/config/ERDiagramPlaygroundSerializableConfig';
import PartialERDiagramPlaygroundConfig from '@/config/PartialERDiagramPlaygroundConfig';

export const LAST_CONFIG_VERSION = '0.1.0-alpha.2-1615063137254';

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
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				databaseModelToCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
			},
			postgresql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				databaseModelToCodeConverterConfig: postgresqlDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				databaseModelToCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.getDefaultConfig(),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.getDefaultConfig()
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.getDefaultConfig(),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.getDefaultConfig()
			},
			plantuml: plantumlEntityRelationshipModelToDiagramCodeConverterConfigManager.getDefaultConfig(),
			nomnoml: nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.getDefaultConfig(),
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
			postgresql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.postgresql.databaseModelGeneratorConfig,
						partialConfig?.postgresql?.databaseModelGeneratorConfig
				),
				databaseModelToCodeConverterConfig: postgresqlDatabaseModelToCodeConverterConfigManager.mergeConfigs(
						fullConfig.postgresql.databaseModelToCodeConverterConfig,
						partialConfig?.postgresql?.databaseModelToCodeConverterConfig
				),
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
			},
			plantuml: plantumlEntityRelationshipModelToDiagramCodeConverterConfigManager.mergeConfigs(
					fullConfig.plantuml,
					partialConfig?.plantuml
			),
			nomnoml: nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.mergeConfigs(
					fullConfig.nomnoml,
					partialConfig?.nomnoml
			)
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
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.oracle.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.oracle.databaseModelToCodeConverterConfig),
			},
			postgresql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.postgresql.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: postgresqlDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.postgresql.databaseModelToCodeConverterConfig),
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.sqlserver.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.sqlserver.databaseModelToCodeConverterConfig),
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertToSerializableObject(fullConfig.java.classModelGeneratorConfig),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.java.classModelToCodeConverterConfig)
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertToSerializableObject(fullConfig.typescript.classModelGeneratorConfig),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.typescript.classModelToCodeConverterConfig)
			},
			plantuml: plantumlEntityRelationshipModelToDiagramCodeConverterConfigManager.convertToSerializableObject(fullConfig.plantuml),
			nomnoml: nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.convertToSerializableObject(fullConfig.nomnoml)
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
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.oracle.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.oracle.databaseModelToCodeConverterConfig),
			},
			postgresql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.postgresql.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: postgresqlDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.postgresql.databaseModelToCodeConverterConfig),
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.sqlserver.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.sqlserver.databaseModelToCodeConverterConfig),
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.java.classModelGeneratorConfig),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.java.classModelToCodeConverterConfig)
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.typescript.classModelGeneratorConfig),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.typescript.classModelToCodeConverterConfig)
			},
			plantuml: plantumlEntityRelationshipModelToDiagramCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.plantuml),
			nomnoml: nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.nomnoml)
		};
	}

}

const erdiagramPlaygroundConfigManager = new ERDiagramPlaygroundConfigManager();
export default erdiagramPlaygroundConfigManager;
