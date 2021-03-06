import {computed} from 'vue';
import {
	DatabaseModelGenerator,
	DatabaseModelGeneratorConfig,
	DatabaseModelToCodeConverter,
	EntityRelationshipModelToDatabaseCodeConverter
} from '@nestorrente/erdiagram';

export default function useEntityRelationshipModelToDatabaseCodeConverter(
		databaseModelGeneratorConfigSupplier: () => DatabaseModelGeneratorConfig,
		databaseModelToCodeConverterSupplier: () => DatabaseModelToCodeConverter
) {

	const databaseModelGeneratorConfig = computed(databaseModelGeneratorConfigSupplier);
	const databaseModelGenerator = computed(() => new DatabaseModelGenerator(databaseModelGeneratorConfig.value));

	const databaseModelToCodeConverter = computed(databaseModelToCodeConverterSupplier);

	return computed(() => {
		return new EntityRelationshipModelToDatabaseCodeConverter(
				databaseModelGenerator.value,
				databaseModelToCodeConverter.value
		);
	});

}
