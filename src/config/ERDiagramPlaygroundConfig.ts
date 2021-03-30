import {
	ClassModelGeneratorConfig,
	ClassModelToCodeConverterConfig,
	DatabaseModelGeneratorConfig,
	DatabaseModelToCodeConverterConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	MysqlDatabaseModelToCodeConverterConfig,
	NomnomlEntityRelationshipModelToDiagramCodeConverterConfig,
	OracleDatabaseModelToCodeConverterConfig,
	PlantUmlEntityRelationshipModelToDiagramCodeConverterConfig,
	SqlServerDatabaseModelToCodeConverterConfig,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';

export default interface ERDiagramPlaygroundConfig {
	_version: string;
	erModelParser: EntityRelationshipModelParserConfig;
	mysql: DatabaseDialectConfig<MysqlDatabaseModelToCodeConverterConfig>;
	sqlserver: DatabaseDialectConfig<SqlServerDatabaseModelToCodeConverterConfig>;
	oracle: DatabaseDialectConfig<OracleDatabaseModelToCodeConverterConfig>;
	java: ClassLanguageConfig<JavaClassModelToCodeConverterConfig>;
	typescript: ClassLanguageConfig<TypeScriptClassModelToCodeConverterConfig>;
	plantuml: PlantUmlEntityRelationshipModelToDiagramCodeConverterConfig;
	nomnoml: NomnomlEntityRelationshipModelToDiagramCodeConverterConfig;
}

export interface DatabaseDialectConfig<T extends DatabaseModelToCodeConverterConfig> {
	databaseModelGeneratorConfig: DatabaseModelGeneratorConfig;
	databaseModelToCodeConverterConfig: T;
}

export interface ClassLanguageConfig<T extends ClassModelToCodeConverterConfig<any>> {
	classModelGeneratorConfig: ClassModelGeneratorConfig;
	classModelToCodeConverterConfig: T;
}
