import {
	ClassModelGeneratorConfig,
	DatabaseModelGeneratorConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelGeneratorConfig,
	JavaxValidationTransformerConfig,
	JpaTransformerConfig,
	MysqlDialectConfig,
	NomnomlEntityRelationshipModelSourceCodeGeneratorConfig,
	OracleDialectConfig,
	PostgresqlDialectConfig,
	SqlDialectConfig,
	SqliteDialectConfig,
	SqlServerDialectConfig,
	TypeScriptClassModelToCodeConverterConfig
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
		classModel: ClassModelGeneratorConfig;
		code: JavaClassModelGeneratorConfig;
		transformers: {
			validation: {
				enabled: boolean;
				config: JavaxValidationTransformerConfig;
			};
			jpa: {
				enabled: boolean;
				databaseModel: DatabaseModelGeneratorConfig;
				config: JpaTransformerConfig;
			};
		};
	};
	typescript: {
		classModel: ClassModelGeneratorConfig;
		code: TypeScriptClassModelToCodeConverterConfig;
	};
	nomnoml: NomnomlEntityRelationshipModelSourceCodeGeneratorConfig;
}

export interface DatabaseDialectConfig<T extends SqlDialectConfig> {
	databaseModel: DatabaseModelGeneratorConfig;
	dialectConfig: T;
}
