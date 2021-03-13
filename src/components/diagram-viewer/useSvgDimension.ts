import {nextTick, onMounted, ref} from 'vue';
import {Dimension} from '@/util/geometric-types';
import {Nullable} from '@/util/util-types';

export default function useSvgDimension(svgGetter: () => Nullable<Element>) {

	const svgDimension = ref<Dimension>({
		width: 0,
		height: 0
	});

	function updateSvgSize() {

		const svgElement = svgGetter();

		svgDimension.value = {
			width: getNumberAttribute(svgElement, 'width') ?? 0,
			height: getNumberAttribute(svgElement, 'height') ?? 0
		};

	}

	function getNumberAttribute(element: Nullable<Element>, attributeName: string): number | undefined {
		const attributeValue = element?.getAttribute(attributeName);
		return attributeValue ? parseFloat(attributeValue) : undefined;
	}

	onMounted(updateSvgSize);

	return {
		svgDimension,
		onSvgUpdate() {
			nextTick(updateSvgSize);
		}
	};

}
