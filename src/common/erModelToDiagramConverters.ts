import {NomnomlEntityRelationshipModelToDiagramConverter} from '@nestorrente/erdiagram';
import {computed} from 'vue';
import erModelToCodeConverters from '@/common/erModelToCodeConverters';

const nomnomlConverter = computed(() => {
	return new NomnomlEntityRelationshipModelToDiagramConverter(erModelToCodeConverters.nomnomlConverter.value);
});

export default {
	nomnomlConverter
};
