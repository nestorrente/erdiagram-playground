import useDocumentEventListener from '@/composition/event/useDocumentEventListener';
import {addPoints, Point, substractPoints} from '@/util/geometric-types';
import {getTranslatePosition} from '@/util/css-utils';

export interface PositioningStrategy {

	getElementPosition(element: HTMLElement): Point;

	setElementPosition(element: HTMLElement, newPosition: Point): void;

}

interface DragState {
	element: HTMLElement;
	dragStartPoint: Point;
	elementStartPosition: Point;
}

export default function useDragElement(positioningStrategy: PositioningStrategy) {

	let state: DragState | null = null;

	function onDragStart(event: Event, dragPositionProvider: () => Point) {

		const element = event.currentTarget as HTMLElement;

		state = {
			element,
			dragStartPoint: dragPositionProvider(),
			elementStartPosition: positioningStrategy.getElementPosition(element)
		};

	}

	useDocumentEventListener('pointermove', event => {
		onDragMove(event, () => getCurrentDragPointFromPointer(event));
	});

	useDocumentEventListener('touchmove', (event: TouchEvent) => {
		onDragMove(event, () => getCurrentDragPointFromTouch(event));
	});

	function onDragMove(event: Event, dragPositionProvider: () => Point) {

		if (state == null) {
			return;
		}

		const {
			element,
			dragStartPoint,
			elementStartPosition
		} = state;

		const currentDragPoint = dragPositionProvider();

		const dragDelta: Point = substractPoints(currentDragPoint, dragStartPoint);
		const newPosition: Point = addPoints(elementStartPosition, dragDelta);

		positioningStrategy.setElementPosition(element, newPosition);

	}

	useDocumentEventListener('mouseup', () => state = null);
	useDocumentEventListener('touchend', () => state = null);

	function getCurrentDragPointFromPointer(event: PointerEvent) {
		return {
			x: event.pageX,
			y: event.pageY
		};
	}

	function getCurrentDragPointFromTouch(event: TouchEvent) {
		return {
			x: event.touches[0].pageX,
			y: event.touches[0].pageY
		};
	}

	return {
		onPointerDown(event: PointerEvent) {
			onDragStart(event, () => getCurrentDragPointFromPointer(event));
		},
		onTouchStart(event: TouchEvent) {
			event.preventDefault();
			onDragStart(event, () => getCurrentDragPointFromTouch(event));
		}
	};

}

export function useScrollDrag() {
	return useDragElement({
		getElementPosition(element: HTMLElement): Point {
			return {
				x: -element.scrollLeft,
				y: -element.scrollTop,
			};
		},
		setElementPosition(element: HTMLElement, newPosition: Point): void {
			element.scrollLeft = -newPosition.x;
			element.scrollTop = -newPosition.y;
		}
	});
}

export function useTransformDrag() {
	return useDragElement({
		getElementPosition(element: HTMLElement): Point {
			return getTranslatePosition(element);
		},
		setElementPosition(element: HTMLElement, newPosition: Point): void {
			element.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
		}
	});
}
