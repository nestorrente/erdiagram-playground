import {onBeforeUnmount, onMounted} from 'vue';

export default function useEventListener(
		eventTarget: EventTarget,
		type: string,
		handler: (event: any) => void
) {
	onMounted(() => eventTarget.addEventListener(type, handler));
	onBeforeUnmount(() => eventTarget.removeEventListener(type, handler));
}

export function useDocumentEventListener(type: string, handler: (event: any) => void) {
	useEventListener(document, type, handler);
}

export function useWindowEventListener(type: string, handler: (event: any) => void) {
	useEventListener(window, type, handler);
}
