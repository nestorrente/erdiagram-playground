import {
	DatabaseModelGeneratorConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	MySqlDatabaseModelToCodeConverterConfig,
	SqlServerDatabaseModelToCodeConverterConfig,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';

export default interface ERDiagramPlaygroundConfig {
	erModel: EntityRelationshipModelParserConfig;
	mysqlDatabaseModel: DatabaseModelGeneratorConfig;
	mysql: MySqlDatabaseModelToCodeConverterConfig;
	sqlServerDatabaseModel: DatabaseModelGeneratorConfig;
	sqlserver: SqlServerDatabaseModelToCodeConverterConfig;
	java: JavaClassModelToCodeConverterConfig;
	typescript: TypeScriptClassModelToCodeConverterConfig;
}
