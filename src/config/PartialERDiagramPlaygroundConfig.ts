import {
	DatabaseModelGeneratorConfig,
	EntityRelationshipModelParserConfig,
	MysqlDialectConfig,
	NomnomlSourceCodeGeneratorConfig,
	OracleDialectConfig,
	PartialBeanValidationTransformerConfig,
	PartialClassModelGeneratorConfig,
	PartialJavaClassModelGeneratorConfig,
	PartialJpaTransformerConfig,
	PartialTypeScriptClassModelToCodeConverterConfig,
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
		classModel: PartialClassModelGeneratorConfig;
		code: PartialJavaClassModelGeneratorConfig;
		transformers: Partial<{
			validation: Partial<{
				enabled: boolean;
				config: PartialBeanValidationTransformerConfig;
			}>;
			jpa: Partial<{
				enabled: boolean;
				databaseModel: DatabaseModelGeneratorConfig;
				config: PartialJpaTransformerConfig;
			}>;
		}>;
	}>;
	typescript: Partial<{
		classModel: PartialClassModelGeneratorConfig;
		code: PartialTypeScriptClassModelToCodeConverterConfig;
	}>;
	nomnoml: Partial<NomnomlSourceCodeGeneratorConfig>;
}>;

export default PartialERDiagramPlaygroundConfig;
