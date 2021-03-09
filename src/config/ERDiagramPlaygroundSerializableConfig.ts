import {
	ClassModelGeneratorSerializableConfig,
	ClassModelToCodeConverterSerializableConfig,
	DatabaseModelGeneratorSerializableConfig,
	DatabaseModelToCodeConverterSerializableConfig,
	EntityRelationshipModelParserSerializableConfig,
	JavaClassModelToCodeConverterSerializableConfig,
	MySqlDatabaseModelToCodeConverterSerializableConfig,
	NomnomlEntityRelationshipModelToDiagramCodeConverterSerializableConfig,
	OracleDatabaseModelToCodeConverterSerializableConfig,
	PlantUmlEntityRelationshipModelToDiagramCodeConverterSerializableConfig,
	SqlServerDatabaseModelToCodeConverterSerializableConfig,
	TypeScriptClassModelToCodeConverterSerializableConfig
} from '@nestorrente/erdiagram';

export default interface ERDiagramPlaygroundSerializableConfig {
	_version: string;
	erModelParser: EntityRelationshipModelParserSerializableConfig;
	mysql: DatabaseDialectSerializableConfig<MySqlDatabaseModelToCodeConverterSerializableConfig>;
	sqlserver: DatabaseDialectSerializableConfig<SqlServerDatabaseModelToCodeConverterSerializableConfig>;
	oracle: DatabaseDialectSerializableConfig<OracleDatabaseModelToCodeConverterSerializableConfig>;
	java: ClassLanguageSerializableConfig<JavaClassModelToCodeConverterSerializableConfig>;
	typescript: ClassLanguageSerializableConfig<TypeScriptClassModelToCodeConverterSerializableConfig>;
	nomnoml: NomnomlEntityRelationshipModelToDiagramCodeConverterSerializableConfig;
	plantuml: PlantUmlEntityRelationshipModelToDiagramCodeConverterSerializableConfig;
}

export interface DatabaseDialectSerializableConfig<T extends DatabaseModelToCodeConverterSerializableConfig> {
	databaseModelGeneratorConfig: DatabaseModelGeneratorSerializableConfig;
	databaseModelToCodeConverterConfig: T;
}

export interface ClassLanguageSerializableConfig<T extends ClassModelToCodeConverterSerializableConfig> {
	classModelGeneratorConfig: ClassModelGeneratorSerializableConfig;
	classModelToCodeConverterConfig: T;
}
