import {Point3D} from '@/util/geometric-types';

export function parsePixelsAmount(pixelsAmount: string) {
	return parseInt(pixelsAmount, 10) || 0;
}

export function getTranslatePosition(element: Element): Point3D {

	const computedStyle = getComputedStyle(element);
	// @ts-expect-error
	const matrix = computedStyle.transform || computedStyle.webkitTransform || computedStyle.mozTransform;

	// No transform property. Simply return 0 values.
	if (matrix != null && matrix !== 'none') {

		const match = matrix.match(/matrix(3d)?\((.+)\)/);

		if (match) {

			const matrixValues = match[2].split(', ');

			if (match[1] === '3d') {
				return {
					x: parseInt(matrixValues[12], 10),
					y: parseInt(matrixValues[13], 10),
					z: parseInt(matrixValues[14], 10)
				};
			} else {
				return {
					x: parseInt(matrixValues[4], 10),
					y: parseInt(matrixValues[5], 10),
					z: 0
				};
			}

		}

	}

	return {x: 0, y: 0, z: 0};

}
