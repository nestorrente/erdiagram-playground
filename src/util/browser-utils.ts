import {Dimension} from '@/util/geometric-types';

export function getPageDimension(): Dimension {
	return {
		width: getPageWidth(),
		height: getPageHeight()
	};
}

export function getPageWidth(): number {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export function getPageHeight(): number {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
