import {computed, ComputedRef, nextTick, onBeforeUnmount, ref, Ref, watch} from 'vue';
import ResizeObserver from 'resize-observer-polyfill';
import {Nullable} from '@/util/util-types';
import {useWindowEventListener} from '@/composition/event/useEventListener';
import {debounce} from '@/util/function-utils';

export enum ResizeListenerStrategy {
	WINDOW_RESIZE_EVENT = 'window_resize_event',
	RESIZE_OBSERVER = 'resize_observer'
}

export interface UseElementSizeOptions {
	delayMilliseconds: number;
	resizeListenerStrategy: ResizeListenerStrategy;
}

function getFullOptions(partialOptions?: Partial<UseElementSizeOptions>): UseElementSizeOptions {
	return {
		delayMilliseconds: 200,
		resizeListenerStrategy: ResizeListenerStrategy.RESIZE_OBSERVER,
		...partialOptions
	};
}

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

	if (resizeListenerStrategy === ResizeListenerStrategy.WINDOW_RESIZE_EVENT) {

		useWindowEventListener('resize', onResize);

	} else {

		const resizeObserver = new ResizeObserver(onResize);

		watch(element, (newValue, oldValue) => {
			oldValue && resizeObserver.unobserve(oldValue);
			newValue && resizeObserver.observe(newValue);
		});

		onBeforeUnmount(() => resizeObserver.disconnect());

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
