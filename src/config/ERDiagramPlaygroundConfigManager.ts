import {
	AbstractComponentConfigManager,
	databaseModelGeneratorConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelToCodeConverterConfigManager,
	mysqlDatabaseModelToCodeConverterConfigManager,
	typescriptClassModelToCodeConverterConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';

export class ERDiagramPlaygroundConfigManager extends AbstractComponentConfigManager<ERDiagramPlaygroundConfig> {

	getDefaultConfig(): ERDiagramPlaygroundConfig {
		return {
			erModel: entityRelationshipModelParserConfigManager.getDefaultConfig(),
			database: databaseModelGeneratorConfigManager.getDefaultConfig(),
			mysql: mysqlDatabaseModelToCodeConverterConfigManager.getDefaultConfig(),
			java: javaClassModelToCodeConverterConfigManager.getDefaultConfig(),
			typescript: typescriptClassModelToCodeConverterConfigManager.getDefaultConfig()
		};
	}

	mergeConfigs(fullConfig: ERDiagramPlaygroundConfig, partialConfig?: Partial<ERDiagramPlaygroundConfig>): ERDiagramPlaygroundConfig {
		return {
			erModel: entityRelationshipModelParserConfigManager.mergeConfigs(fullConfig.erModel, partialConfig?.erModel),
			database: databaseModelGeneratorConfigManager.mergeConfigs(fullConfig.database, partialConfig?.database),
			mysql: mysqlDatabaseModelToCodeConverterConfigManager.mergeConfigs(fullConfig.mysql, partialConfig?.mysql),
			java: javaClassModelToCodeConverterConfigManager.mergeConfigs(fullConfig.java, partialConfig?.java),
			typescript: typescriptClassModelToCodeConverterConfigManager.mergeConfigs(fullConfig.typescript, partialConfig?.typescript)
		};
	}

}

const erdiagramPlaygroundConfigManager = new ERDiagramPlaygroundConfigManager();
export default erdiagramPlaygroundConfigManager;
