import {
	ClassModelToCodeConverterConfig,
	DatabaseModelGeneratorConfig,
	DatabaseModelToCodeConverterConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	MySqlDatabaseModelToCodeConverterConfig,
	OracleDatabaseModelToCodeConverterConfig,
	SqlServerDatabaseModelToCodeConverterConfig,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';

export default interface ERDiagramPlaygroundConfig {
	_version: string;
	erModelParser: EntityRelationshipModelParserConfig;
	mysql: DatabaseDialectConfig<MySqlDatabaseModelToCodeConverterConfig>;
	sqlserver: DatabaseDialectConfig<SqlServerDatabaseModelToCodeConverterConfig>;
	oracle: DatabaseDialectConfig<OracleDatabaseModelToCodeConverterConfig>;
	java: ClassLanguageConfig<JavaClassModelToCodeConverterConfig>;
	typescript: ClassLanguageConfig<TypeScriptClassModelToCodeConverterConfig>;
}

export interface DatabaseDialectConfig<T extends DatabaseModelToCodeConverterConfig> {
	databaseModelGeneratorConfig: DatabaseModelGeneratorConfig;
	databaseModelToCodeConverterConfig: T;
}

export interface ClassLanguageConfig<T extends ClassModelToCodeConverterConfig<any>> {
	classModelToCodeConverterConfig: T;
}
