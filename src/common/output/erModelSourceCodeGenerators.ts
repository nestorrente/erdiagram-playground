import useEntityRelationshipModelToSqlSourceCodeGenerator
	from '@/composition/erdiagram/useEntityRelationshipModelToSqlSourceCodeGenerator';
import configStore from '@/store/configStore';
import {
	BeanValidationTransformer,
	JavaClassModelTransformer,
	JavaSourceCodeGenerator,
	JpaTransformer, LombokTransformer,
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

const mysqlConverter = useEntityRelationshipModelToSqlSourceCodeGenerator(
		() => configStore.config.mysql.databaseModel,
		() => new MysqlDialect(configStore.config.mysql.dialectConfig)
);

const oracleConverter = useEntityRelationshipModelToSqlSourceCodeGenerator(
		() => configStore.config.oracle.databaseModel,
		() => new OracleDialect(configStore.config.oracle.dialectConfig)
);

const postgresqlConverter = useEntityRelationshipModelToSqlSourceCodeGenerator(
		() => configStore.config.postgresql.databaseModel,
		() => new PostgresqlDialect(configStore.config.postgresql.dialectConfig)
);

const sqliteConverter = useEntityRelationshipModelToSqlSourceCodeGenerator(
		() => configStore.config.sqlite.databaseModel,
		() => new SqliteDialect(configStore.config.sqlite.dialectConfig)
);

const sqlserverConverter = useEntityRelationshipModelToSqlSourceCodeGenerator(
		() => configStore.config.sqlserver.databaseModel,
		() => new SqlServerDialect(configStore.config.sqlserver.dialectConfig)
);

// TODO move implementation to another file
const javaConverter = (() => {

	const lombokTransformer = computed((): LombokTransformer | null => {

		const lombokConfig = configStore.config.java.transformers.lombok;

		const isAnyAnnotationEnabled = Object.values(lombokConfig).some(e => e);

		if (!isAnyAnnotationEnabled) {
			return null;
		}

		return markRaw(
			new LombokTransformer({
				...lombokConfig,
				getterAnnotation: lombokConfig.getterAnnotation && !lombokConfig.dataAnnotation,
				setterAnnotation: lombokConfig.setterAnnotation && !lombokConfig.dataAnnotation,
				toStringAnnotation: lombokConfig.toStringAnnotation && !lombokConfig.dataAnnotation,
				equalsAndHashCodeAnnotation: lombokConfig.equalsAndHashCodeAnnotation && !lombokConfig.dataAnnotation,
			})
		);

	});

	const jpaTransformer = computed((): JpaTransformer | null => {

		const { javaExtendedPackage } = configStore.config.java.transformers.shared;
		const jpaConfig = configStore.config.java.transformers.jpa;

		if (!jpaConfig.enabled) {
			return null;
		}

		return markRaw(
				JpaTransformer.builder()
						.configureDatabaseModel(jpaConfig.databaseModel)
						.configureJpa({
							...jpaConfig.config,
							javaExtendedPackage
						})
						.build()
		);

	});

	const validationTransformer = computed((): BeanValidationTransformer | null => {

		const { javaExtendedPackage } = configStore.config.java.transformers.shared;
		const validationConfig = configStore.config.java.transformers.validation;

		if (!validationConfig.enabled) {
			return null;
		}

		return markRaw(
				new BeanValidationTransformer({
					...validationConfig.config,
					javaExtendedPackage
				})
		);

	});

	const javaTransformers = computed((): JavaClassModelTransformer[] => {

		const transformers: JavaClassModelTransformer[] = [];

		if (lombokTransformer.value != null) {
			transformers.push(lombokTransformer.value);
		}

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
						.configureJavaClassModel(javaConfig.code)
						.addTransformers(...javaTransformers.value)
						.build()
		);

	});

})();

const typescriptConverter = computed(() => {

	const typescriptConfig = configStore.config.typescript;

	return TypeScriptSourceCodeGenerator.builder()
			.configureClassModel(typescriptConfig.classModel)
			.configureTypeScript(typescriptConfig.code)
			.build();

});

const plantumlConverter = computed(() => new PlantUmlSourceCodeGenerator(configStore.config.plantuml));

const nomnomlConverter = computed(() => new NomnomlSourceCodeGenerator(configStore.config.nomnoml));

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
