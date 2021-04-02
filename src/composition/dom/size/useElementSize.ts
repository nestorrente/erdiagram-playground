import {computed, ComputedRef, nextTick, ref, Ref} from 'vue';
import {Nullable} from '@/util/util-types';
import debounce from 'lodash.debounce';
import {ResizeListenerStrategy, StandardResizeListenerStrategies} from '@/composition/dom/size/ResizeListenerStrategy';

export default function useElementSize(
		element: Ref<Nullable<HTMLElement>>,
		options?: Partial<UseElementSizeOptions>
): ComputedRef<ElementSizeData | undefined> {

	const {
		delayMilliseconds,
		resizeListenerStrategy
	} = getFullOptions(options);

	const elementSizeData = ref<ElementSizeData>();

	function updateElementSizeData() {
		elementSizeData.value = getElementSizeData(element.value);
	}

	// Update size data once the element has been mounted
	nextTick(updateElementSizeData);

	const onResize = delayMilliseconds > 0
			? debounce(updateElementSizeData, delayMilliseconds)
			: updateElementSizeData;

	resizeListenerStrategy(element, onResize);

	return computed(() => elementSizeData.value);

}

export interface UseElementSizeOptions {
	delayMilliseconds: number;
	resizeListenerStrategy: ResizeListenerStrategy;
}

function getFullOptions(partialOptions?: Partial<UseElementSizeOptions>): UseElementSizeOptions {
	return {
		delayMilliseconds: 200,
		resizeListenerStrategy: StandardResizeListenerStrategies.RESIZE_OBSERVER,
		...partialOptions
	};
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
