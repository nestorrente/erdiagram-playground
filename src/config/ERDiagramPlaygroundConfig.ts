import {
	DatabaseModelGeneratorConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	MySqlDatabaseModelToCodeConverterConfig,
	OracleDatabaseModelToCodeConverterConfig,
	SqlServerDatabaseModelToCodeConverterConfig,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';

export default interface ERDiagramPlaygroundConfig {
	erModel: EntityRelationshipModelParserConfig;
	mysqlDatabaseModel: DatabaseModelGeneratorConfig;
	mysql: MySqlDatabaseModelToCodeConverterConfig;
	sqlServerDatabaseModel: DatabaseModelGeneratorConfig;
	sqlserver: SqlServerDatabaseModelToCodeConverterConfig;
	oracleDatabaseModel: DatabaseModelGeneratorConfig;
	oracle: OracleDatabaseModelToCodeConverterConfig;
	java: JavaClassModelToCodeConverterConfig;
	typescript: TypeScriptClassModelToCodeConverterConfig;
}
