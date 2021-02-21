import {Ref, watch} from 'vue';

export default function useDelegatedClick(
		element: Readonly<Ref<HTMLElement | undefined>>,
		selector: string,
		handler: (event: MouseEvent) => void
) {

	watch(element, (newElement, oldElement) => {
		if (oldElement) {
			oldElement.removeEventListener('click', onElementClick);
		}
		if (newElement) {
			newElement.addEventListener('click', onElementClick);
		}
	}, {immediate: true});

	function onElementClick(event: MouseEvent) {
		if (isWantedDescendantClick(event)) {
			handler(event);
		}
	}

	function isWantedDescendantClick(event: MouseEvent) {

		const eventTarget = event.target as HTMLElement;

		if (eventTarget.matches(selector)) {
			return true;
		}

		const closest = eventTarget.closest(selector);

		return closest != null && element.value!.contains(closest);

	}

}