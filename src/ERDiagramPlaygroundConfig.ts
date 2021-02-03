import {
	DatabaseModelGeneratorConfig,
	defaultDatabaseModelGeneratorConfig,
	defaultEntityRelationshipModelParserConfig,
	defaultJavaClassModelToCodeConverterConfig,
	defaultMySqlDatabaseModelToCodeConverterConfig,
	defaultTypeScriptClassModelToCodeConverterConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	mergeDatabaseModelGeneratorConfigs,
	mergeEntityRelationshipModelParserConfigs,
	mergeJavaClassModelToCodeConverterConfigs,
	mergeMySqlDatabaseModelToCodeConverterConfigs,
	mergeTypeScriptClassModelToCodeConverterConfigs,
	MySqlDatabaseModelToCodeConverterConfig,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';

export default interface ERDiagramPlaygroundConfig {
	erModel: EntityRelationshipModelParserConfig;
	database: DatabaseModelGeneratorConfig;
	mysql: MySqlDatabaseModelToCodeConverterConfig;
	java: JavaClassModelToCodeConverterConfig;
	typescript: TypeScriptClassModelToCodeConverterConfig;
}

export const defaultERDiagramPlaygroundConfig: ERDiagramPlaygroundConfig = {
	erModel: defaultEntityRelationshipModelParserConfig,
	database: defaultDatabaseModelGeneratorConfig,
	mysql: defaultMySqlDatabaseModelToCodeConverterConfig,
	java: defaultJavaClassModelToCodeConverterConfig,
	typescript: defaultTypeScriptClassModelToCodeConverterConfig
};

export function mergeERDiagramPlagroundConfigs(
		fullConfig: ERDiagramPlaygroundConfig,
		partialConfig?: Partial<ERDiagramPlaygroundConfig>
) {
	return {
		erModel: mergeEntityRelationshipModelParserConfigs(fullConfig.erModel, partialConfig?.erModel),
		database: mergeDatabaseModelGeneratorConfigs(fullConfig.database, partialConfig?.database),
		mysql: mergeMySqlDatabaseModelToCodeConverterConfigs(fullConfig.mysql, partialConfig?.mysql),
		java: mergeJavaClassModelToCodeConverterConfigs(fullConfig.java, partialConfig?.java),
		typescript: mergeTypeScriptClassModelToCodeConverterConfigs(fullConfig.typescript, partialConfig?.typescript)
	};
}
