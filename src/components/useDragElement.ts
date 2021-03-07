import useDocumentEventListener from '@/composition/event/useDocumentEventListener';

interface DragState {
	element: HTMLElement;
	dragStartPoint: Point;
	elementScrollStartPoint: Point;
}

interface Point {
	x: number;
	y: number;
}

export default function useDragElement() {

	let state: DragState | null = null;

	function onDragStart(event: Event, dragPositionProvider: () => Point) {

		const element = event.currentTarget as HTMLElement;

		state = {
			element,
			dragStartPoint: dragPositionProvider(),
			elementScrollStartPoint: {
				x: element.scrollLeft,
				y: element.scrollTop
			}
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
			elementScrollStartPoint
		} = state;

		const currentDragPoint = dragPositionProvider();

		const dragDelta: Point = {
			x: currentDragPoint.x - dragStartPoint.x,
			y: currentDragPoint.y - dragStartPoint.y
		};

		element.scrollLeft = elementScrollStartPoint.x - dragDelta.x;
		element.scrollTop = elementScrollStartPoint.y - dragDelta.y;

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
