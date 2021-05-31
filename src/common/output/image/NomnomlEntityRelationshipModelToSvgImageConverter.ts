import {EntityRelationshipModel, NomnomlEntityRelationshipModelSourceCodeGenerator} from '@nestorrente/erdiagram';
import AbstractEntityRelationshipModelToSvgImageConverter
	from '@/common/output/image/AbstractEntityRelationshipModelToSvgImageConverter';
import {renderSvg} from 'nomnoml';

export default class NomnomlEntityRelationshipModelToSvgImageConverter extends AbstractEntityRelationshipModelToSvgImageConverter {

	constructor(
			private readonly nomnomlEntityRelationshipModelSourceCodeGenerator: NomnomlEntityRelationshipModelSourceCodeGenerator
	) {
		super();
	}

	protected convertNonEmptyModelToDiagram(model: EntityRelationshipModel): Promise<string> {
		const diagramCode = this.nomnomlEntityRelationshipModelSourceCodeGenerator.generateSourceCode(model);
		return Promise.resolve(renderSvg(diagramCode));
	}

}
