import useEntityRelationshipModelToSqlCodeConverter
	from '@/composition/erdiagram/useEntityRelationshipModelToSqlCodeConverter';
import configStore from '@/store/configStore';
import {
	JavaClassModelToCodeConverter,
	MysqlDialect,
	NomnomlEntityRelationshipModelToDiagramCodeConverter,
	OracleDialect,
	PlantUmlEntityRelationshipModelToDiagramCodeConverter,
	PostgresqlDialect,
	SqliteDialect,
	SqlServerDialect,
	TypeScriptClassModelToCodeConverter
} from '@nestorrente/erdiagram';
import useEntityRelationshipModelToClassCodeConverter
	from '@/composition/erdiagram/useEntityRelationshipModelToClassCodeConverter';
import {computed} from 'vue';

const mysqlConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.mysql.databaseModelGeneratorConfig,
		() => new MysqlDialect(configStore.config.mysql.dialectConfig)
);

const oracleConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.oracle.databaseModelGeneratorConfig,
		() => new OracleDialect(configStore.config.oracle.dialectConfig)
);

const postgresqlConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.postgresql.databaseModelGeneratorConfig,
		() => new PostgresqlDialect(configStore.config.postgresql.dialectConfig)
);

const sqliteConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.sqlite.databaseModelGeneratorConfig,
		() => new SqliteDialect(configStore.config.sqlite.dialectConfig)
);

const sqlserverConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.sqlserver.databaseModelGeneratorConfig,
		() => new SqlServerDialect(configStore.config.sqlserver.dialectConfig)
);

const javaConverter = useEntityRelationshipModelToClassCodeConverter(
		() => configStore.config.java.classModelGeneratorConfig,
		() => new JavaClassModelToCodeConverter(configStore.config.java.classModelToCodeConverterConfig)
);

const typescriptConverter = useEntityRelationshipModelToClassCodeConverter(
		() => configStore.config.typescript.classModelGeneratorConfig,
		() => new TypeScriptClassModelToCodeConverter(configStore.config.typescript.classModelToCodeConverterConfig)
);

const plantumlConverter = computed(() => {
	return new PlantUmlEntityRelationshipModelToDiagramCodeConverter(configStore.config.plantuml);
});

const nomnomlConverter = computed(() => {
	return new NomnomlEntityRelationshipModelToDiagramCodeConverter(configStore.config.nomnoml);
});

export default {
	mysqlConverter,
	sqliteConverter,
	sqlserverConverter,
	postgresqlConverter,
	oracleConverter,
	javaConverter,
	typescriptConverter,
	plantumlConverter,
	nomnomlConverter
};
