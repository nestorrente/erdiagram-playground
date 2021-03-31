import PositionManager from '@/util/positioning-strategy/PositionManager';
import {Point} from '@/util/geometric-types';
import {applyBoundariesToNumber} from '@/util/math-utils';
import {ref, Ref} from 'vue';
import useVerticalSplitPanelLeftColumnBoundaries
	from '@/components/generic/split-panel/useVerticalSplitPanelLeftColumnBoundaries';

export default function useVerticalSplitPanelLeftColumnWidthPercentAndPositionManager(
		leftColumnRef: Ref<HTMLElement | undefined>
) {

	// We use 16px, as it's the equivalent to 1em for the current font size.
	const oneEmInPixels = 16;

	const columnGap = oneEmInPixels * 0.75;

	const leftColumnWidthPercent = ref(50);

	const {
		leftColumnMinWidth,
		leftColumnMaxWidth
	} = useVerticalSplitPanelLeftColumnBoundaries();

	const leftColumnWidthPositionManager: PositionManager = {
		getPosition(): Point {
			return {
				x: leftColumnRef.value?.offsetWidth ?? 0,
				y: 0
			};
		},
		setPosition(newPosition: Point) {

			const leftColumn = leftColumnRef.value;

			if (leftColumn) {
				leftColumnWidthPercent.value = getNewLeftColumnWidthPercent(leftColumn, newPosition.x);
			}

		}
	};

	// TODO add boundaries for min and max width
	// TODO once the boundaries are added, recompute the position on window resize
	function getNewLeftColumnWidthPercent(leftColumn: HTMLElement, newLeftColumnWidth: number) {

		const boundNewLeftColumnWidth = applyBoundariesToNumber(newLeftColumnWidth, leftColumnMinWidth.value, leftColumnMaxWidth.value);

		const previousLeftColumnWidth = leftColumn.offsetWidth;
		const previousLeftColumnWidthPercent = leftColumnWidthPercent.value;

		return previousLeftColumnWidthPercent * (boundNewLeftColumnWidth + columnGap) / (previousLeftColumnWidth + columnGap);

	}

	return {
		leftColumnWidthPercent,
		leftColumnWidthPositionManager
	};

}