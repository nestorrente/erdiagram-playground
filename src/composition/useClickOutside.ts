import {onBeforeUnmount, onMounted, Ref} from 'vue';

export default function useClickOutside(
		element: Readonly<Ref<HTMLElement | undefined>>,
		handler: (event: MouseEvent) => void
) {

	onMounted(() => document.addEventListener('click', onDocumentClick));
	onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick));

	function onDocumentClick(event: MouseEvent) {
		if (isOutsideClick(event)) {
			handler(event);
		}
	}

	function isOutsideClick(event: MouseEvent) {

		if (element.value == null) {
			return false;
		}

		const eventTarget = event.target as Node;

		return !element.value.contains(eventTarget);

	}

}