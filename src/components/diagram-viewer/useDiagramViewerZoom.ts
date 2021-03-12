import {computed, nextTick, ref, Ref} from 'vue';
import {PositioningStrategy} from '@/composition/dom/useDragElement';
import {
	addPoints,
	getCenterPoint,
	Point,
	roundPoint,
	scalePoint,
	substractPoints,
	unscalePoint
} from '@/util/geometric-types';

const ZOOM_SCALES = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3];

export default function useDiagramViewerZoom(diagramViewportRef: Ref<HTMLElement | undefined>, positioningStrategy: PositioningStrategy) {

	const zoomScaleIndex = ref(ZOOM_SCALES.indexOf(1));
	const zoomScale = computed(() => ZOOM_SCALES[zoomScaleIndex.value]);

	function incrementZoom(viewportReferencePoint?: Point) {
		changeZoom(zoomScaleIndex.value + 1, viewportReferencePoint);
	}

	function decrementZoom(viewportReferencePoint?: Point) {
		changeZoom(zoomScaleIndex.value - 1, viewportReferencePoint);
	}

	function changeZoom(newZoomScaleIndex: number, viewportReferencePoint: Point = getViewportCenterPoint()) {

		const previousZoomScale = zoomScale.value;
		zoomScaleIndex.value = Math.min(Math.max(newZoomScaleIndex, 0), ZOOM_SCALES.length - 1);

		if (previousZoomScale != zoomScale.value) {
			// adjustScrollAfterScaleChanged(viewportReferencePoint, previousZoomScale);
			nextTick(() => adjustScrollAfterScaleChanged(viewportReferencePoint, previousZoomScale));
		}

	}

	function adjustScrollAfterScaleChanged(viewportReferencePoint: Point, previousZoomScale: number) {

		const diagramViewportElement = diagramViewportRef.value;

		if (!diagramViewportElement) {
			return;
		}

		const currentTranslationPosition = positioningStrategy.getElementPosition(diagramViewportElement);
		const diagramReferencePoint = substractPoints(viewportReferencePoint, currentTranslationPosition);

		const unscaledDiagramPoint = unscalePoint(diagramReferencePoint, previousZoomScale);
		const newDiagramReferencePoint = scalePoint(unscaledDiagramPoint, zoomScale.value);

		const newViewportReferencePoint = addPoints(newDiagramReferencePoint, currentTranslationPosition);

		const viewportReferencePointsDiff = substractPoints(newViewportReferencePoint, viewportReferencePoint);

		const newTranslationPosition = roundPoint(substractPoints(currentTranslationPosition, viewportReferencePointsDiff));

		positioningStrategy.setElementPosition(diagramViewportElement, newTranslationPosition);

	}

	function getViewportCenterPoint(): Point {

		const diagramViewportElement = diagramViewportRef.value;

		if (diagramViewportElement == null) {
			return {x: 0, y: 0};
		}

		return getCenterPoint({
			width: diagramViewportElement.clientWidth,
			height: diagramViewportElement.clientHeight
		});

	}

	function onWheel(event: WheelEvent) {

		event.preventDefault();

		const delta = event.deltaX || event.deltaY || event.deltaZ;

		const viewportReferencePoint: Point = {
			x: event.offsetX,
			y: event.offsetY
		};

		if (delta < 0) {
			incrementZoom(viewportReferencePoint);
		} else if (delta > 0) {
			decrementZoom(viewportReferencePoint);
		}

	}

	return {
		zoomScale,
		incrementZoom,
		decrementZoom,
		onWheel
	};

}
