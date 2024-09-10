import {
	DatabaseModelConfig,
	EntityRelationshipModelParserConfig,
	JavaExtendedPackage,
	MysqlDialectConfig,
	OracleDialectConfig,
	PartialBeanValidationConfig,
	PartialClassModelConfig,
	PartialJavaClassModelConfig,
	PartialJpaConfig,
	PartialLombokConfig,
	PartialNomnomlConfig,
	PartialPlantUmlConfig,
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
			shared: Partial<{
				javaExtendedPackage: JavaExtendedPackage;
			}>;
			validation: Partial<{
				enabled: boolean;
				config: PartialBeanValidationConfig;
			}>;
			jpa: Partial<{
				enabled: boolean;
				databaseModel: DatabaseModelConfig;
				config: PartialJpaConfig;
			}>;
			lombok: PartialLombokConfig;
		}>;
	}>;
	typescript: Partial<{
		classModel: PartialClassModelConfig;
		code: PartialTypeScriptConfig;
	}>;
	nomnoml: PartialNomnomlConfig;
	plantuml: PartialPlantUmlConfig;
}>;

export default PartialERDiagramPlaygroundConfig;
