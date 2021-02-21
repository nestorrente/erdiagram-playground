import useHtmlElementSize from '@/composition/size/useHtmlElementSize';
import {computed, ComputedRef, Ref} from 'vue';

interface ScrollbarsSize {
	horizontal: number;
	vertical: number;
}

export default function useElementScrollbarsSize(element: Ref<HTMLElement | null | undefined>): ComputedRef<ScrollbarsSize> {

	const elementSize = useHtmlElementSize(element);

	return computed(() => {

		const codeBlockSizeValue = elementSize.value;

		if (codeBlockSizeValue == null) {
			return {
				horizontal: 0,
				vertical: 0
			};
		}

		return {
			horizontal: codeBlockSizeValue.offsetHeight - codeBlockSizeValue.clientHeight,
			vertical: codeBlockSizeValue.offsetWidth - codeBlockSizeValue.clientWidth
		};

	});

}