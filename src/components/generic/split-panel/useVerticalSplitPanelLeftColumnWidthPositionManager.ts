import PositionManager from '@/util/positioning-strategy/PositionManager';
import {Point} from '@/util/geometric-types';
import {Ref} from 'vue';

export default function useVerticalSplitPanelLeftColumnWidthPositionManager(
		leftColumnRef: Ref<HTMLElement | undefined>,
		leftColumnWidthPercent: Ref<number>
) {

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
				leftColumnWidthPercent.value = convertWidthToPercent(leftColumn, newPosition.x);
			}

		}
	};

	function convertWidthToPercent(leftColumn: HTMLElement, width: number) {
		const parentWidth = getParentWidth(leftColumn);
		return 100 * width / parentWidth;
	}

	function getParentWidth(leftColumn: HTMLElement) {
		return leftColumn.parentElement!.offsetWidth;
	}

	return leftColumnWidthPositionManager;

}