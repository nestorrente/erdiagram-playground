import {EntityRelationshipModel} from '@nestorrente/erdiagram';

export default interface EntityRelationshipModelToImageConverter {
	convertToDiagram(model: EntityRelationshipModel): Promise<string>;
}
