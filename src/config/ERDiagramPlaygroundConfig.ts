import type {
	BeanValidationConfig,
	ClassModelConfig,
	DatabaseModelConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelConfig,
	JavaExtendedPackage,
	JpaConfig,
	LombokConfig,
	MysqlDialectConfig,
	NomnomlConfig,
	OracleDialectConfig,
	PlantUmlConfig,
	PostgresqlDialectConfig,
	SqlDialectConfig,
	SqliteDialectConfig,
	SqlServerDialectConfig,
	TypeScriptConfig
} from '@nestorrente/erdiagram';

export default interface ERDiagramPlaygroundConfig {
	_version: string;
	parser: EntityRelationshipModelParserConfig;
	mysql: DatabaseDialectConfig<MysqlDialectConfig>;
	oracle: DatabaseDialectConfig<OracleDialectConfig>;
	postgresql: DatabaseDialectConfig<PostgresqlDialectConfig>;
	sqlite: DatabaseDialectConfig<SqliteDialectConfig>;
	sqlserver: DatabaseDialectConfig<SqlServerDialectConfig>;
	java: {
		classModel: ClassModelConfig;
		code: JavaClassModelConfig;
		transformers: {
			shared: {
				javaExtendedPackage: JavaExtendedPackage;
			}
			validation: {
				enabled: boolean;
				config: BeanValidationConfig;
			};
			jpa: {
				enabled: boolean;
				databaseModel: DatabaseModelConfig;
				config: JpaConfig;
			};
			lombok: LombokConfig;
		};
	};
	typescript: {
		classModel: ClassModelConfig;
		code: TypeScriptConfig;
	};
	nomnoml: NomnomlConfig;
	plantuml: PlantUmlConfig;
}

export interface DatabaseDialectConfig<T extends SqlDialectConfig> {
	databaseModel: DatabaseModelConfig;
	dialectConfig: T;
}
