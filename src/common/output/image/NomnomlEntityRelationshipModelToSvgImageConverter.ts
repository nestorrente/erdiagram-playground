import {EntityRelationshipModel, NomnomlEntityRelationshipModelToDiagramCodeConverter} from '@nestorrente/erdiagram';
import AbstractEntityRelationshipModelToSvgImageConverter
	from '@/common/output/image/AbstractEntityRelationshipModelToSvgImageConverter';
import {renderSvg} from 'nomnoml';

export default class NomnomlEntityRelationshipModelToSvgImageConverter extends AbstractEntityRelationshipModelToSvgImageConverter {

	constructor(
			private readonly erModelToDiagramCodeConverter: NomnomlEntityRelationshipModelToDiagramCodeConverter
	) {
		super();
	}

	protected convertNonEmptyModelToDiagram(model: EntityRelationshipModel): Promise<string> {
		const diagramCode = this.erModelToDiagramCodeConverter.convertToCode(model);
		return Promise.resolve(renderSvg(diagramCode));
	}

}
