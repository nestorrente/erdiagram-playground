import {useDocumentEventListener} from '@/composition/event/useEventListener';
import {addPoints, Point, substractPoints} from '@/util/geometric-types';
import PositionManager from '@/util/positioning-strategy/PositionManager';

interface DragState {
	dragStartPoint: Point;
	elementStartPosition: Point;
}

export default function useDragElement(positionManager: PositionManager) {

	let state: DragState | null = null;

	function onDragStart(event: Event, dragPositionProvider: () => Point) {

		state = {
			dragStartPoint: dragPositionProvider(),
			elementStartPosition: positionManager.getPosition()
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

		event.preventDefault();

		const {
			dragStartPoint,
			elementStartPosition
		} = state;

		const currentDragPoint = dragPositionProvider();

		const dragDelta = substractPoints(currentDragPoint, dragStartPoint);
		const newPosition = addPoints(elementStartPosition, dragDelta);

		positionManager.setPosition(newPosition);

	}

	useDocumentEventListener('pointerup', (event: PointerEvent) => {
		if (event.isPrimary && event.button === 0) {
			stopDrag();
		}
	});
	useDocumentEventListener('touchend', stopDrag);

	function stopDrag() {
		state = null;
	}

	function cancelDrag() {
		if (state != null) {
			positionManager.setPosition(state.elementStartPosition);
			stopDrag();
		}
	}

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
			if (event.isPrimary && event.button === 0) {
				onDragStart(event, () => getCurrentDragPointFromPointer(event));
			}
		},
		onTouchStart(event: TouchEvent) {
			event.preventDefault();
			onDragStart(event, () => getCurrentDragPointFromTouch(event));
		},
		stopDrag,
		cancelDrag
	};

}
