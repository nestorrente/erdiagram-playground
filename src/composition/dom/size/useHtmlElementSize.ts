import {computed, ComputedRef, nextTick, ref, Ref, watch} from 'vue';
import ResizeObserver from 'resize-observer-polyfill';

export default function useHtmlElementSize(element: Ref<HTMLElement | null | undefined>): ComputedRef<ElementSizeData | undefined> {

	const elementSizeData = ref<ElementSizeData>();

	// Update size data once the element has been mounted
	nextTick(updateElementSizeData);

	const resizeObserver = new ResizeObserver(() => {
		console.log('Se resiza el elemento');
		updateElementSizeData();
	});

	watch(element, (newValue, oldValue) => {
		oldValue && resizeObserver.unobserve(oldValue);
		newValue && resizeObserver.observe(newValue);
	});

	function updateElementSizeData() {
		elementSizeData.value = getElementSizeData(element.value);
	}

	return computed(() => elementSizeData.value);

}

export interface ElementSizeData {
	clientWidth: number;
	offsetWidth: number;
	scrollWidth: number;
	clientHeight: number;
	offsetHeight: number;
	scrollHeight: number;
}

function getElementSizeData(element: HTMLElement | null | undefined): ElementSizeData | undefined {

	if (element == null) {
		return undefined;
	}

	const {
		clientWidth,
		offsetWidth,
		scrollWidth,
		clientHeight,
		offsetHeight,
		scrollHeight
	} = element;

	return {
		clientWidth,
		offsetWidth,
		scrollWidth,
		clientHeight,
		offsetHeight,
		scrollHeight
	};

}
