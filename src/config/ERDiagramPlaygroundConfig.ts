import {
	ClassModelGeneratorConfig,
	ClassModelToCodeConverterConfig,
	DatabaseModelGeneratorConfig,
	DatabaseModelToCodeConverterConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	MySqlDatabaseModelToCodeConverterConfig,
	NomnomlEntityRelationshipModelToDiagramCodeConverterConfig,
	OracleDatabaseModelToCodeConverterConfig,
	PlantUmlEntityRelationshipModelToDiagramCodeConverterConfig,
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
	nomnoml: NomnomlEntityRelationshipModelToDiagramCodeConverterConfig;
	plantuml: PlantUmlEntityRelationshipModelToDiagramCodeConverterConfig;
}

export interface DatabaseDialectConfig<T extends DatabaseModelToCodeConverterConfig> {
	databaseModelGeneratorConfig: DatabaseModelGeneratorConfig;
	databaseModelToCodeConverterConfig: T;
}

export interface ClassLanguageConfig<T extends ClassModelToCodeConverterConfig<any>> {
	classModelGeneratorConfig: ClassModelGeneratorConfig;
	classModelToCodeConverterConfig: T;
}
