import {EntityRelationshipModel, NomnomlSourceCodeGenerator} from '@nestorrente/erdiagram';
import AbstractEntityRelationshipModelToSvgImageConverter
	from '@/common/output/image/AbstractEntityRelationshipModelToSvgImageConverter';
import {renderSvg} from 'nomnoml';

export default class NomnomlEntityRelationshipModelToSvgImageConverter extends AbstractEntityRelationshipModelToSvgImageConverter {

	constructor(
			private readonly nomnomlSourceCodeGenerator: NomnomlSourceCodeGenerator
	) {
		super();
	}

	protected convertNonEmptyModelToDiagram(model: EntityRelationshipModel): Promise<string> {
		const diagramCode = this.nomnomlSourceCodeGenerator.generateSourceCode(model);
		return Promise.resolve(renderSvg(diagramCode));
	}

}
