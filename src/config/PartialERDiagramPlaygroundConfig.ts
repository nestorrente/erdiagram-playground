import {
	DatabaseModelConfig,
	EntityRelationshipModelParserConfig,
	MysqlDialectConfig,
	NomnomlConfig,
	OracleDialectConfig,
	PartialBeanValidationConfig,
	PartialClassModelConfig,
	PartialJavaClassModelConfig,
	PartialJpaConfig,
	PartialTypeScriptConfig,
	PostgresqlDialectConfig,
	SqliteDialectConfig,
	SqlServerDialectConfig
} from '@nestorrente/erdiagram';
import {DatabaseDialectConfig} from '@/config/ERDiagramPlaygroundConfig';

type PartialERDiagramPlaygroundConfig = Partial<{
	_version: string;
	parser: EntityRelationshipModelParserConfig;
	mysql: Partial<DatabaseDialectConfig<MysqlDialectConfig>>;
	oracle: Partial<DatabaseDialectConfig<OracleDialectConfig>>;
	postgresql: Partial<DatabaseDialectConfig<PostgresqlDialectConfig>>;
	sqlite: Partial<DatabaseDialectConfig<SqliteDialectConfig>>;
	sqlserver: Partial<DatabaseDialectConfig<SqlServerDialectConfig>>;
	java: Partial<{
		classModel: PartialClassModelConfig;
		code: PartialJavaClassModelConfig;
		transformers: Partial<{
			validation: Partial<{
				enabled: boolean;
				config: PartialBeanValidationConfig;
			}>;
			jpa: Partial<{
				enabled: boolean;
				databaseModel: DatabaseModelConfig;
				config: PartialJpaConfig;
			}>;
		}>;
	}>;
	typescript: Partial<{
		classModel: PartialClassModelConfig;
		code: PartialTypeScriptConfig;
	}>;
	nomnoml: Partial<NomnomlConfig>;
}>;

export default PartialERDiagramPlaygroundConfig;
