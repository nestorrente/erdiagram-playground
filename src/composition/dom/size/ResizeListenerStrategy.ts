import {onBeforeUnmount, Ref, watch} from 'vue';
import {Nullable} from '@/util/util-types';
import ResizeObserver from 'resize-observer-polyfill';

export type ResizeListenerStrategy = (element: Ref<Nullable<HTMLElement>>, onResize: () => void) => void;

const resizeObserverResizeListenerStrategy: ResizeListenerStrategy = (element, onResize) => {

	const resizeObserver = new ResizeObserver(onResize);

	watch(element, (newValue, oldValue) => {
		oldValue && resizeObserver.unobserve(oldValue);
		newValue && resizeObserver.observe(newValue);
	});

	onBeforeUnmount(() => resizeObserver.disconnect());
};

export const StandardResizeListenerStrategies = {
	RESIZE_OBSERVER: resizeObserverResizeListenerStrategy
};
