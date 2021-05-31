import useEntityRelationshipModelToSqlCodeConverter
	from '@/composition/erdiagram/useEntityRelationshipModelToSqlCodeConverter';
import configStore from '@/store/configStore';
import {
	JavaClassModelTransformer,
	JavaEntityRelationshipModelSourceCodeGenerator,
	JavaxValidationTransformer,
	JpaTransformer,
	MysqlDialect,
	NomnomlEntityRelationshipModelSourceCodeGenerator,
	OracleDialect,
	PlantUmlEntityRelationshipModelSourceCodeGenerator,
	PostgresqlDialect,
	SqliteDialect,
	SqlServerDialect,
	TypeScriptEntityRelationshipModelSourceCodeGenerator
} from '@nestorrente/erdiagram';
import {computed, markRaw} from 'vue';

const mysqlConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.mysql.databaseModel,
		() => new MysqlDialect(configStore.config.mysql.dialectConfig)
);

const oracleConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.oracle.databaseModel,
		() => new OracleDialect(configStore.config.oracle.dialectConfig)
);

const postgresqlConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.postgresql.databaseModel,
		() => new PostgresqlDialect(configStore.config.postgresql.dialectConfig)
);

const sqliteConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.sqlite.databaseModel,
		() => new SqliteDialect(configStore.config.sqlite.dialectConfig)
);

const sqlserverConverter = useEntityRelationshipModelToSqlCodeConverter(
		() => configStore.config.sqlserver.databaseModel,
		() => new SqlServerDialect(configStore.config.sqlserver.dialectConfig)
);

// TODO move implementation to another file
const javaConverter = (() => {

	const jpaTransformer = computed((): JpaTransformer | null => {

		const jpaTransformerConfig = configStore.config.java.transformers.jpa;

		if (!jpaTransformerConfig.enabled) {
			return null;
		}

		return markRaw(
				JpaTransformer.builder()
						.configureDatabaseModel(jpaTransformerConfig.databaseModel)
						.configureJpa(jpaTransformerConfig.config)
						.build()
		);

	});

	const validationTransformer = computed((): JavaxValidationTransformer | null => {

		const validationTransformerConfig = configStore.config.java.transformers.validation;

		if (!validationTransformerConfig.enabled) {
			return null;
		}

		return markRaw(
				new JavaxValidationTransformer(validationTransformerConfig.config)
		);

	});

	const javaTransformers = computed((): JavaClassModelTransformer[] => {

		const transformers: JavaClassModelTransformer[] = [];

		if (jpaTransformer.value != null) {
			transformers.push(jpaTransformer.value);
		}

		if (validationTransformer.value != null) {
			transformers.push(validationTransformer.value);
		}

		return transformers;

	});

	return computed(() => {

		const javaConfig = configStore.config.java;

		return markRaw(
				JavaEntityRelationshipModelSourceCodeGenerator.builder()
						.configureClassModel(javaConfig.classModel)
						.configureJavaCode(javaConfig.code)
						.addTransformers(...javaTransformers.value)
						.build()
		);

	});

})();

const typescriptConverter = computed(() => {

	const typescriptConfig = configStore.config.typescript;

	return TypeScriptEntityRelationshipModelSourceCodeGenerator.builder()
			.configureClassModel(typescriptConfig.classModel)
			.configureTypeScriptCode(typescriptConfig.code)
			.build();

});

const plantumlConverter = computed(() => {
	return new PlantUmlEntityRelationshipModelSourceCodeGenerator();
});

const nomnomlConverter = computed(() => {
	return new NomnomlEntityRelationshipModelSourceCodeGenerator(configStore.config.nomnoml);
});

// FIXME rename all to "{format}Generator"
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
