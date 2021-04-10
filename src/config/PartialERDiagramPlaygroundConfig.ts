import {
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	MysqlDialectConfig,
	NomnomlEntityRelationshipModelToDiagramCodeConverterConfig,
	OracleDialectConfig,
	PostgresqlDialectConfig,
	SqliteDialectConfig,
	SqlServerDialectConfig,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';
import {ClassLanguageConfig, DatabaseDialectConfig} from '@/config/ERDiagramPlaygroundConfig';

type PartialERDiagramPlaygroundConfig = Partial<{
	_version: string;
	erModelParser: EntityRelationshipModelParserConfig;
	mysql: Partial<DatabaseDialectConfig<MysqlDialectConfig>>;
	oracle: Partial<DatabaseDialectConfig<OracleDialectConfig>>;
	postgresql: Partial<DatabaseDialectConfig<PostgresqlDialectConfig>>;
	sqlite: Partial<DatabaseDialectConfig<SqliteDialectConfig>>;
	sqlserver: Partial<DatabaseDialectConfig<SqlServerDialectConfig>>;
	java: Partial<ClassLanguageConfig<JavaClassModelToCodeConverterConfig>>;
	typescript: Partial<ClassLanguageConfig<TypeScriptClassModelToCodeConverterConfig>>;
	nomnoml: Partial<NomnomlEntityRelationshipModelToDiagramCodeConverterConfig>;
}>;

export default PartialERDiagramPlaygroundConfig;
