import {
	NomnomlEntityRelationshipModelToDiagramConverter,
	PlantUmlEntityRelationshipModelToDiagramConverter
} from '@nestorrente/erdiagram';
import {computed} from 'vue';
import erModelToCodeConverters from '@/common/erModelToCodeConverters';

const nomnomlConverter = computed(() => {
	return new NomnomlEntityRelationshipModelToDiagramConverter(erModelToCodeConverters.nomnomlConverter.value);
});

const plantumlConverter = computed(() => {
	return new PlantUmlEntityRelationshipModelToDiagramConverter(erModelToCodeConverters.plantumlConverter.value);
});

export default {
	plantumlConverter,
	nomnomlConverter
};
