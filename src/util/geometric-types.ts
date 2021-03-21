import {applyBoundariesToNumber} from '@/util/math-utils';

export interface Point {
	x: number;
	y: number;
}

export interface Point3D extends Point {
	z: number;
}

export function addPoints(point1: Point, point2: Point): Point {
	return {
		x: point1.x + point2.x,
		y: point1.y + point2.y
	};
}

export function substractPoints(point1: Point, point2: Point): Point {
	return {
		x: point1.x - point2.x,
		y: point1.y - point2.y
	};
}

export function scalePoint(point: Point, scale: number): Point {
	return {
		x: point.x * scale,
		y: point.y * scale
	};
}

export function unscalePoint(point: Point, scale: number): Point {
	return {
		x: point.x / scale,
		y: point.y / scale
	};
}

export function roundPoint(point: Point): Point {
	return {
		x: Math.round(point.x),
		y: Math.round(point.y)
	};
}

export interface Dimension {
	width: number;
	height: number;
}

export function substractDimension(dimension1: Dimension, dimension2: Dimension): Dimension {
	return {
		width: dimension1.width - dimension2.width,
		height: dimension1.height - dimension2.height
	};
}

export function scaleDimension(dimension: Dimension, scale: number): Dimension {
	return {
		width: dimension.width * scale,
		height: dimension.height * scale
	};
}

export function unscaleDimension(dimension: Dimension, scale: number): Dimension {
	return {
		width: dimension.width / scale,
		height: dimension.height / scale
	};
}

export function getDimensionCenterPoint(dimension: Dimension): Point {
	return {
		x: dimension.width / 2,
		y: dimension.height / 2
	};
}

export function enlargeDimensionToAspectRatio(dimension: Dimension, targetAspectRatioAsDimension: Dimension): Dimension {

	const dimensionAspectRatio = dimension.width / dimension.height;
	const targetAspectRatio = targetAspectRatioAsDimension.width / targetAspectRatioAsDimension.height;

	if (dimensionAspectRatio > targetAspectRatio) {
		return {
			width: dimension.width,
			height: dimension.width / targetAspectRatio
		};
	}

	if (dimensionAspectRatio < targetAspectRatio) {
		return {
			width: dimension.height * targetAspectRatio,
			height: dimension.height
		};
	}

	return dimension;

}

export interface Rectangle extends Dimension, Point {

}

export function getRectangleCenterPoint(rectangle: Rectangle): Point {
	return {
		x: (rectangle.x + rectangle.width) / 2,
		y: (rectangle.y + rectangle.height) / 2
	};
}

export function getEnclosingRectangle(rectangle1: Rectangle, rectangle2: Rectangle): Rectangle {

	const rectangle1MaxPoint = getMaxPoint(rectangle1);
	const rectangle2MaxPoint = getMaxPoint(rectangle2);

	return {
		x: Math.min(rectangle1.x, rectangle2.x),
		y: Math.min(rectangle1.y, rectangle2.y),
		width: Math.max(rectangle1MaxPoint.x, rectangle2MaxPoint.x),
		height: Math.max(rectangle1MaxPoint.y, rectangle2MaxPoint.y)
	};

}

export function getMaxPoint(rectangle: Rectangle): Point {
	return {
		x: rectangle.x + rectangle.width,
		y: rectangle.y + rectangle.height
	};
}

export function enlargeRectangleToAspectRatioFromCenter(rectangle: Rectangle, targetAspectRatioAsDimension: Dimension): Rectangle {

	const newRectangleDimension = enlargeDimensionToAspectRatio(rectangle, targetAspectRatioAsDimension);

	const deltaDimension = substractDimension(rectangle, newRectangleDimension);

	const halfDeltaWidth = deltaDimension.width / 2;
	const halfDeltaHeight = deltaDimension.height / 2;

	return {
		x: rectangle.x - halfDeltaWidth,
		y: rectangle.y - halfDeltaHeight,
		width: rectangle.width + halfDeltaWidth,
		height: rectangle.height + halfDeltaHeight
	};

}

export function movePointInsideBoundaries(point: Point, boundaries: Rectangle): Point {
	return {
		x: applyBoundariesToNumber(point.x, boundaries.x, boundaries.width),
		y: applyBoundariesToNumber(point.y, boundaries.y, boundaries.height),
	};
}
