import {movePointInsideBoundaries, Point, Rectangle} from '@/util/geometric-types';

export default interface PositionManager {

	getPosition(): Point;

	setPosition(newPosition: Point): void;

}

export function addBoundariesToPositionManager(
		positionManager: PositionManager,
		boundariesGetter: () => Rectangle
): PositionManager {
	return {
		getPosition() {
			return positionManager.getPosition();
		},
		setPosition(newPosition) {
			const boundaries = boundariesGetter();
			const boundPosition = movePointInsideBoundaries(newPosition, boundaries);
			positionManager.setPosition(boundPosition);
		}
	};
}

