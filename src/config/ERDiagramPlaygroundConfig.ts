import {
	ClassModelGeneratorConfig,
	ClassModelToCodeConverterConfig,
	DatabaseModelGeneratorConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	MysqlDialectConfig,
	NomnomlEntityRelationshipModelToDiagramCodeConverterConfig,
	OracleDialectConfig,
	PlantUmlEntityRelationshipModelToDiagramCodeConverterConfig,
	PostgresqlDialectConfig,
	SqlDialectConfig,
	SqliteDialectConfig,
	SqlServerDialectConfig,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';

export default interface ERDiagramPlaygroundConfig {
	_version: string;
	erModelParser: EntityRelationshipModelParserConfig;
	mysql: DatabaseDialectConfig<MysqlDialectConfig>;
	oracle: DatabaseDialectConfig<OracleDialectConfig>;
	postgresql: DatabaseDialectConfig<PostgresqlDialectConfig>;
	sqlite: DatabaseDialectConfig<SqliteDialectConfig>;
	sqlserver: DatabaseDialectConfig<SqlServerDialectConfig>;
	java: ClassLanguageConfig<JavaClassModelToCodeConverterConfig>;
	typescript: ClassLanguageConfig<TypeScriptClassModelToCodeConverterConfig>;
	plantuml: PlantUmlEntityRelationshipModelToDiagramCodeConverterConfig;
	nomnoml: NomnomlEntityRelationshipModelToDiagramCodeConverterConfig;
}

export interface DatabaseDialectConfig<T extends SqlDialectConfig> {
	databaseModelGeneratorConfig: DatabaseModelGeneratorConfig;
	dialectConfig: T;
}

export interface ClassLanguageConfig<T extends ClassModelToCodeConverterConfig<any>> {
	classModelGeneratorConfig: ClassModelGeneratorConfig;
	classModelToCodeConverterConfig: T;
}
