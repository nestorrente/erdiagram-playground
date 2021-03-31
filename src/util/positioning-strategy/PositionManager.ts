import {movePointInsideBoundaries, Point, Rectangle} from '@/util/geometric-types';
import {isRef, Ref} from 'vue';

export default interface PositionManager {

	getPosition(): Point;

	setPosition(newPosition: Point): void;

}

export function addBoundariesToPositionManager(
		positionManager: PositionManager,
		boundaries: Ref<Rectangle> | (() => Rectangle)
): PositionManager {

	const boundariesGetter = isRef(boundaries) ? () => boundaries.value : boundaries;

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

