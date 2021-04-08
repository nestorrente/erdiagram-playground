import {computed} from 'vue';
import {
	DatabaseModelGenerator,
	DatabaseModelGeneratorConfig,
	DatabaseModelToSqlCodeConverter,
	EntityRelationshipModelToDatabaseCodeConverter,
	SqlDialect
} from '@nestorrente/erdiagram';

export default function useEntityRelationshipModelToSqlCodeConverter(
		databaseModelGeneratorConfigSupplier: () => DatabaseModelGeneratorConfig,
		databaseModelToCodeConverterSupplier: () => SqlDialect
) {

	const databaseModelGeneratorConfig = computed(databaseModelGeneratorConfigSupplier);
	const databaseModelGenerator = computed(() => new DatabaseModelGenerator(databaseModelGeneratorConfig.value));

	const databaseModelToCodeConverter = computed(databaseModelToCodeConverterSupplier);

	return computed(() => {
		return new EntityRelationshipModelToDatabaseCodeConverter(
				databaseModelGenerator.value,
				new DatabaseModelToSqlCodeConverter(databaseModelToCodeConverter.value)
		);
	});

}
