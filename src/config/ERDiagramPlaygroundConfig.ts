import {
	DatabaseModelGeneratorConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
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
