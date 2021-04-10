import {
	AbstractComponentConfigManager,
	classModelGeneratorConfigManager,
	databaseModelGeneratorConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelToCodeConverterConfigManager,
	mysqlDialectConfigManager,
	nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager,
	oracleDialectConfigManager,
	postgresqlDialectConfigManager,
	sqliteDialectConfigManager,
	sqlServerDialectConfigManager,
	typescriptClassModelToCodeConverterConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import ERDiagramPlaygroundSerializableConfig from '@/config/ERDiagramPlaygroundSerializableConfig';
import PartialERDiagramPlaygroundConfig from '@/config/PartialERDiagramPlaygroundConfig';

export const LAST_CONFIG_VERSION = '0.1.0-beta.0-1617909401187';

export class ERDiagramPlaygroundConfigManager
		extends AbstractComponentConfigManager<ERDiagramPlaygroundConfig, PartialERDiagramPlaygroundConfig, ERDiagramPlaygroundSerializableConfig> {

	getDefaultConfig(): ERDiagramPlaygroundConfig {
		return {
			_version: LAST_CONFIG_VERSION,
			erModelParser: entityRelationshipModelParserConfigManager.getDefaultConfig(),
			mysql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: mysqlDialectConfigManager.getDefaultConfig()
			},
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: oracleDialectConfigManager.getDefaultConfig()
			},
			postgresql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: postgresqlDialectConfigManager.getDefaultConfig()
			},
			sqlite: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: sqliteDialectConfigManager.getDefaultConfig()
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: sqlServerDialectConfigManager.getDefaultConfig()
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.getDefaultConfig(),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.getDefaultConfig()
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.getDefaultConfig(),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.getDefaultConfig()
			},
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
				dialectConfig: mysqlDialectConfigManager.mergeConfigs(
						fullConfig.mysql.dialectConfig,
						partialConfig?.mysql?.dialectConfig
				)
			},
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.oracle.databaseModelGeneratorConfig,
						partialConfig?.oracle?.databaseModelGeneratorConfig
				),
				dialectConfig: oracleDialectConfigManager.mergeConfigs(
						fullConfig.oracle.dialectConfig,
						partialConfig?.oracle?.dialectConfig
				),
			},
			postgresql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.postgresql.databaseModelGeneratorConfig,
						partialConfig?.postgresql?.databaseModelGeneratorConfig
				),
				dialectConfig: postgresqlDialectConfigManager.mergeConfigs(
						fullConfig.postgresql.dialectConfig,
						partialConfig?.postgresql?.dialectConfig
				),
			},
			sqlite: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.sqlite.databaseModelGeneratorConfig,
						partialConfig?.sqlite?.databaseModelGeneratorConfig
				),
				dialectConfig: sqliteDialectConfigManager.mergeConfigs(
						fullConfig.sqlite.dialectConfig,
						partialConfig?.sqlite?.dialectConfig
				),
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.sqlserver.databaseModelGeneratorConfig,
						partialConfig?.sqlserver?.databaseModelGeneratorConfig
				),
				dialectConfig: sqlServerDialectConfigManager.mergeConfigs(
						fullConfig.sqlserver.dialectConfig,
						partialConfig?.sqlserver?.dialectConfig
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
				databaseModelToCodeConverterConfig: mysqlDialectConfigManager.convertToSerializableObject(fullConfig.mysql.dialectConfig)
			},
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.oracle.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: oracleDialectConfigManager.convertToSerializableObject(fullConfig.oracle.dialectConfig),
			},
			postgresql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.postgresql.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: postgresqlDialectConfigManager.convertToSerializableObject(fullConfig.postgresql.dialectConfig),
			},
			sqlite: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.sqlite.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: sqliteDialectConfigManager.convertToSerializableObject(fullConfig.sqlite.dialectConfig),
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.sqlserver.databaseModelGeneratorConfig),
				databaseModelToCodeConverterConfig: sqlServerDialectConfigManager.convertToSerializableObject(fullConfig.sqlserver.dialectConfig),
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertToSerializableObject(fullConfig.java.classModelGeneratorConfig),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.java.classModelToCodeConverterConfig)
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertToSerializableObject(fullConfig.typescript.classModelGeneratorConfig),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.typescript.classModelToCodeConverterConfig)
			},
			nomnoml: nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.convertToSerializableObject(fullConfig.nomnoml)
		};
	}

	convertFromSerializableObject(serializableConfig: ERDiagramPlaygroundSerializableConfig): ERDiagramPlaygroundConfig {
		return {
			_version: serializableConfig._version,
			erModelParser: entityRelationshipModelParserConfigManager.convertFromSerializableObject(serializableConfig.erModelParser),
			mysql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.mysql.databaseModelGeneratorConfig),
				dialectConfig: mysqlDialectConfigManager.convertFromSerializableObject(serializableConfig.mysql.databaseModelToCodeConverterConfig)
			},
			oracle: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.oracle.databaseModelGeneratorConfig),
				dialectConfig: oracleDialectConfigManager.convertFromSerializableObject(serializableConfig.oracle.databaseModelToCodeConverterConfig),
			},
			postgresql: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.postgresql.databaseModelGeneratorConfig),
				dialectConfig: postgresqlDialectConfigManager.convertFromSerializableObject(serializableConfig.postgresql.databaseModelToCodeConverterConfig),
			},
			sqlite: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.sqlite.databaseModelGeneratorConfig),
				dialectConfig: sqliteDialectConfigManager.convertFromSerializableObject(serializableConfig.sqlite.databaseModelToCodeConverterConfig),
			},
			sqlserver: {
				databaseModelGeneratorConfig: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.sqlserver.databaseModelGeneratorConfig),
				dialectConfig: sqlServerDialectConfigManager.convertFromSerializableObject(serializableConfig.sqlserver.databaseModelToCodeConverterConfig),
			},
			java: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.java.classModelGeneratorConfig),
				classModelToCodeConverterConfig: javaClassModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.java.classModelToCodeConverterConfig)
			},
			typescript: {
				classModelGeneratorConfig: classModelGeneratorConfigManager.convertFromSerializableObject(serializableConfig.typescript.classModelGeneratorConfig),
				classModelToCodeConverterConfig: typescriptClassModelToCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.typescript.classModelToCodeConverterConfig)
			},
			nomnoml: nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.convertFromSerializableObject(serializableConfig.nomnoml)
		};
	}

}

const erdiagramPlaygroundConfigManager = new ERDiagramPlaygroundConfigManager();
export default erdiagramPlaygroundConfigManager;
