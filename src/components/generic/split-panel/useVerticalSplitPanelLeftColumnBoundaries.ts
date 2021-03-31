import {ref} from 'vue';
import {useWindowEventListener} from '@/composition/event/useEventListener';
import {getPageWidth} from '@/util/browser-utils';
import {debounce} from '@/util/function-utils';

const LEFT_COLUMN_MIN_WIDTH = 410;
const RIGHT_COLUMN_MIN_WIDTH = 410;

export default function useVerticalSplitPanelLeftColumnBoundaries() {

	// We use 16px, as it's the equivalent to 1em for the current font size.
	const oneEmInPixels = 16;

	const columnGap = oneEmInPixels * 0.75;
	const horizontalPageMargin = oneEmInPixels * 0.75;

	const leftColumnMinWidth = ref(LEFT_COLUMN_MIN_WIDTH);
	const leftColumnMaxWidth = ref(computeLeftColumnMaxWidth());

	useWindowEventListener('resize', debounce(() => {
		leftColumnMaxWidth.value = computeLeftColumnMaxWidth();
	}, 200));

	function computeLeftColumnMaxWidth() {
		return getPageWidth() - 2 * horizontalPageMargin - 2 * columnGap - RIGHT_COLUMN_MIN_WIDTH;
	}

	return {
		leftColumnMinWidth,
		leftColumnMaxWidth
	};

}