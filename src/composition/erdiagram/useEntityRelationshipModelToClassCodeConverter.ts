import {computed} from 'vue';
import {
	ClassModelGenerator,
	ClassModelGeneratorConfig,
	ClassModelToCodeConverter,
	EntityRelationshipModelToClassCodeConverter
} from '@nestorrente/erdiagram';

export default function useEntityRelationshipModelToClassCodeConverter(
		classModelGeneratorConfigSupplier: () => ClassModelGeneratorConfig,
		classModelToCodeConverterSupplier: () => ClassModelToCodeConverter
) {

	const classModelGeneratorConfig = computed(classModelGeneratorConfigSupplier);
	const classModelGenerator = computed(() => new ClassModelGenerator(classModelGeneratorConfig.value));

	const classModelToCodeConverter = computed(classModelToCodeConverterSupplier);

	return computed(() => {
		return new EntityRelationshipModelToClassCodeConverter(
				classModelGenerator.value,
				classModelToCodeConverter.value
		);
	});

}