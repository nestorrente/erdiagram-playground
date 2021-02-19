import {computed} from 'vue';
import {
	ClassModelGenerator,
	ClassModelToCodeConverter,
	EntityRelationshipModelToClassCodeConverter
} from '@nestorrente/erdiagram';

export default function useEntityRelationshipModelToClassCodeConverter(
		classModelToCodeConverterSupplier: () => ClassModelToCodeConverter
) {

	const classModelGenerator = new ClassModelGenerator();
	const classModelToCodeConverter = computed(classModelToCodeConverterSupplier);

	return computed(() => {
		return new EntityRelationshipModelToClassCodeConverter(
				classModelGenerator,
				classModelToCodeConverter.value
		);
	});

}