import {
	AbstractComponentConfigManager,
	databaseModelGeneratorConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelToCodeConverterConfigManager,
	mysqlDatabaseModelToCodeConverterConfigManager,
	sqlServerDatabaseModelToCodeConverterConfigManager,
	typescriptClassModelToCodeConverterConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';

export class ERDiagramPlaygroundConfigManager extends AbstractComponentConfigManager<ERDiagramPlaygroundConfig> {

	getDefaultConfig(): ERDiagramPlaygroundConfig {
		return {
			erModel: entityRelationshipModelParserConfigManager.getDefaultConfig(),
			mysqlDatabaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
			mysql: mysqlDatabaseModelToCodeConverterConfigManager.getDefaultConfig(),
			sqlServerDatabaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
			sqlserver: sqlServerDatabaseModelToCodeConverterConfigManager.getDefaultConfig(),
			java: javaClassModelToCodeConverterConfigManager.getDefaultConfig(),
			typescript: typescriptClassModelToCodeConverterConfigManager.getDefaultConfig()
		};
	}

	mergeConfigs(fullConfig: ERDiagramPlaygroundConfig, partialConfig?: Partial<ERDiagramPlaygroundConfig>): ERDiagramPlaygroundConfig {
		return {
			erModel: entityRelationshipModelParserConfigManager.mergeConfigs(fullConfig.erModel, partialConfig?.erModel),
			mysqlDatabaseModel: databaseModelGeneratorConfigManager.mergeConfigs(fullConfig.mysqlDatabaseModel, partialConfig?.mysqlDatabaseModel),
			mysql: mysqlDatabaseModelToCodeConverterConfigManager.mergeConfigs(fullConfig.mysql, partialConfig?.mysql),
			sqlServerDatabaseModel: databaseModelGeneratorConfigManager.mergeConfigs(fullConfig.sqlServerDatabaseModel, partialConfig?.sqlServerDatabaseModel),
			sqlserver: sqlServerDatabaseModelToCodeConverterConfigManager.mergeConfigs(fullConfig.sqlserver, partialConfig?.sqlserver),
			java: javaClassModelToCodeConverterConfigManager.mergeConfigs(fullConfig.java, partialConfig?.java),
			typescript: typescriptClassModelToCodeConverterConfigManager.mergeConfigs(fullConfig.typescript, partialConfig?.typescript)
		};
	}

}

const erdiagramPlaygroundConfigManager = new ERDiagramPlaygroundConfigManager();
export default erdiagramPlaygroundConfigManager;
