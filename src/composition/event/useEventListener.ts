import {isRef, onBeforeUnmount, onMounted, Ref, watch} from 'vue';
import {Nullable} from '@/util/util-types';

export default function useEventListener(
		eventTarget: EventTarget | Ref<Nullable<EventTarget>>,
		type: string,
		handler: (event: any) => void
) {
	if (isRef(eventTarget)) {
		useEventListenerWithEventTargetRef(eventTarget, type, handler);
	} else {
		useEventListenerWithStaticEventTarget(eventTarget, type, handler);
	}
}

export function useDocumentEventListener(type: string, handler: (event: any) => void) {
	useEventListenerWithStaticEventTarget(document, type, handler);
}

export function useWindowEventListener(type: string, handler: (event: any) => void) {
	useEventListenerWithStaticEventTarget(window, type, handler);
}

function useEventListenerWithEventTargetRef(
		eventTargetRef: Ref<Nullable<EventTarget>>,
		type: string,
		handler: (event: any) => void
) {

	onMounted(() => addEventListener(eventTargetRef.value));
	onBeforeUnmount(() => removeEventListener(eventTargetRef.value));

	watch(eventTargetRef, (newEventTarget, oldEventTarget) => {
		removeEventListener(oldEventTarget);
		addEventListener(newEventTarget);
	});

	function addEventListener(eventTarget: Nullable<EventTarget>) {
		eventTarget?.addEventListener(type, handler);
	}

	function removeEventListener(eventTarget: Nullable<EventTarget>) {
		eventTarget?.removeEventListener(type, handler);
	}

}

function useEventListenerWithStaticEventTarget(
		eventTarget: EventTarget,
		type: string,
		handler: (event: any) => void
) {
	onMounted(() => eventTarget.addEventListener(type, handler));
	onBeforeUnmount(() => eventTarget.removeEventListener(type, handler));
}
