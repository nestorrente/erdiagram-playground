import {Point, Rectangle} from '@/util/geometric-types';
import {applyBoundariesToNumber} from '@/util/math-utils';

export default interface PositioningStrategy {

	getElementPosition(element: HTMLElement): Point;

	setElementPosition(element: HTMLElement, newPosition: Point): void;

}

export function addBoundariesToPositionStrategy(
		positioningStrategy: PositioningStrategy,
		boundariesGetter: () => Rectangle
): PositioningStrategy {
	return {
		getElementPosition(element) {
			return positioningStrategy.getElementPosition(element);
		},
		setElementPosition(element, newPosition) {
			const boundaries = boundariesGetter();
			const boundPosition = movePointInsideBoundaries(newPosition, boundaries);
			positioningStrategy.setElementPosition(element, boundPosition);
		}
	};
}

function movePointInsideBoundaries(point: Point, boundaries: Rectangle): Point {
	return {
		x: applyBoundariesToNumber(point.x, boundaries.x, boundaries.width),
		y: applyBoundariesToNumber(point.y, boundaries.y, boundaries.height),
	};
}

