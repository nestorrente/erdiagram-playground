import {computed} from 'vue';
import NomnomlEntityRelationshipModelToSvgImageConverter
	from '@/common/output/image/NomnomlEntityRelationshipModelToSvgImageConverter';
import PlantUmlEntityRelationshipModelToSvgImageConverter
	from '@/common/output/image/PlantUmlEntityRelationshipModelToSvgImageConverter';
import erModelSourceCodeGenerators from '@/common/output/erModelSourceCodeGenerators';

const nomnomlConverter = computed(() => {
	return new NomnomlEntityRelationshipModelToSvgImageConverter(erModelSourceCodeGenerators.nomnomlConverter.value);
});

const plantumlConverter = computed(() => {
	return new PlantUmlEntityRelationshipModelToSvgImageConverter(erModelSourceCodeGenerators.plantumlConverter.value);
});

export default {
	plantumlConverter,
	nomnomlConverter
};
