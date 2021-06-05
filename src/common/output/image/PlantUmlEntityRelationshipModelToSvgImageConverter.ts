import {EntityRelationshipModel, PlantUmlSourceCodeGenerator} from '@nestorrente/erdiagram';
import AbstractEntityRelationshipModelToSvgImageConverter
	from '@/common/output/image/AbstractEntityRelationshipModelToSvgImageConverter';

const PLANTUML_IMAGE_BASE_URL = `https://www.plantuml.com/plantuml/svg/~h`;

export default class PlantUmlEntityRelationshipModelToSvgImageConverter extends AbstractEntityRelationshipModelToSvgImageConverter {

	constructor(
			private readonly plantUmlSourceCodeGenerator: PlantUmlSourceCodeGenerator
	) {
		super();
	}

	protected convertNonEmptyModelToDiagram(model: EntityRelationshipModel): Promise<string> {
		const diagramCode = this.plantUmlSourceCodeGenerator.generateSourceCode(model);
		const diagramUrl = this.getDiagramUrl(diagramCode);
		return this.fetchDiagram(diagramUrl);
	}

	private getDiagramUrl(diagramCode: string) {
		const diagramHexCode = this.convertToHexString(diagramCode);
		return PLANTUML_IMAGE_BASE_URL + diagramHexCode;
	}

	private convertToHexString(text: string) {
		return [...text].map(character => this.convertToHexChar(character)).join('');
	}

	private convertToHexChar(character: string) {
		return character.charCodeAt(0)
				.toString(16)
				.padStart(2, '0');
	}

	private fetchDiagram(diagramUrl: string): Promise<string> {
		return fetch(diagramUrl).then(response => response.text());
	}

}
