import {computed} from 'vue';
import NomnomlEntityRelationshipModelToSvgImageConverter
	from '@/common/output/image/NomnomlEntityRelationshipModelToSvgImageConverter';
import PlantUmlEntityRelationshipModelToSvgImageConverter
	from '@/common/output/image/PlantUmlEntityRelationshipModelToSvgImageConverter';
import erModelToCodeConverters from '@/common/output/erModelToCodeConverters';

const nomnomlConverter = computed(() => {
	return new NomnomlEntityRelationshipModelToSvgImageConverter(erModelToCodeConverters.nomnomlConverter.value);
});

const plantumlConverter = computed(() => {
	return new PlantUmlEntityRelationshipModelToSvgImageConverter(erModelToCodeConverters.plantumlConverter.value);
});

export default {
	plantumlConverter,
	nomnomlConverter
};
