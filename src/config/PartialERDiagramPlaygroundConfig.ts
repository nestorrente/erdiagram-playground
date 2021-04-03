import {
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	MysqlDatabaseModelToCodeConverterConfig,
	NomnomlEntityRelationshipModelToDiagramCodeConverterConfig,
	OracleDatabaseModelToCodeConverterConfig,
	PlantUmlEntityRelationshipModelToDiagramCodeConverterConfig,
	PostgresqlDatabaseModelToCodeConverterConfig,
	SqlServerDatabaseModelToCodeConverterConfig,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';
import {ClassLanguageConfig, DatabaseDialectConfig} from '@/config/ERDiagramPlaygroundConfig';

type PartialERDiagramPlaygroundConfig = Partial<{
	_version: string;
	erModelParser: EntityRelationshipModelParserConfig;
	mysql: Partial<DatabaseDialectConfig<MysqlDatabaseModelToCodeConverterConfig>>;
	oracle: Partial<DatabaseDialectConfig<OracleDatabaseModelToCodeConverterConfig>>;
	postgresql: Partial<DatabaseDialectConfig<PostgresqlDatabaseModelToCodeConverterConfig>>;
	sqlserver: Partial<DatabaseDialectConfig<SqlServerDatabaseModelToCodeConverterConfig>>;
	java: Partial<ClassLanguageConfig<JavaClassModelToCodeConverterConfig>>;
	typescript: Partial<ClassLanguageConfig<TypeScriptClassModelToCodeConverterConfig>>;
	plantuml: Partial<PlantUmlEntityRelationshipModelToDiagramCodeConverterConfig>;
	nomnoml: Partial<NomnomlEntityRelationshipModelToDiagramCodeConverterConfig>;
}>;

export default PartialERDiagramPlaygroundConfig;
