import {computed, ComputedRef, ref, Ref, watch} from 'vue';
import ResizeObserver from 'resize-observer-polyfill';

export default function useHtmlElementSize(element: Ref<HTMLElement | null | undefined>): ComputedRef<ElementSizeData | null> {

	const elementSizeData = ref<ElementSizeData | null>(getElementSizeData(element.value));

	const resizeObserver = new ResizeObserver(() => {
		elementSizeData.value = getElementSizeData(element.value);
	});

	watch(element, (newValue, oldValue) => {
		oldValue && resizeObserver.unobserve(oldValue);
		newValue && resizeObserver.observe(newValue);
	});

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

function getElementSizeData(element: HTMLElement | null | undefined): ElementSizeData | null {

	if (element == null) {
		return null;
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
