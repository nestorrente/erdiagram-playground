import useEntityRelationshipModelToSqlCodeConverter
	from '@/composition/erdiagram/useEntityRelationshipModelToSqlCodeConverter';
import configStore from '@/store/configStore';
import {
	BeanValidationTransformer,
	JavaClassModelTransformer,
	JavaSourceCodeGenerator,
	JpaTransformer,
	MysqlDialect,
	NomnomlSourceCodeGenerator,
	OracleDialect,
	PlantUmlSourceCodeGenerator,
	PostgresqlDialect,
	SqliteDialect,
	SqlServerDialect,
	TypeScriptSourceCodeGenerator
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

	const validationTransformer = computed((): BeanValidationTransformer | null => {

		const validationTransformerConfig = configStore.config.java.transformers.validation;

		if (!validationTransformerConfig.enabled) {
			return null;
		}

		return markRaw(
				new BeanValidationTransformer(validationTransformerConfig.config)
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
				JavaSourceCodeGenerator.builder()
						.configureClassModel(javaConfig.classModel)
						.configureJavaCode(javaConfig.code)
						.addTransformers(...javaTransformers.value)
						.build()
		);

	});

})();

const typescriptConverter = computed(() => {

	const typescriptConfig = configStore.config.typescript;

	return TypeScriptSourceCodeGenerator.builder()
			.configureClassModel(typescriptConfig.classModel)
			.configureTypeScriptCode(typescriptConfig.code)
			.build();

});

const plantumlConverter = computed(() => {
	return new PlantUmlSourceCodeGenerator();
});

const nomnomlConverter = computed(() => {
	return new NomnomlSourceCodeGenerator(configStore.config.nomnoml);
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
