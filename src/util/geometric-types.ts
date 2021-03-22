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

export interface Rectangle extends Dimension, Point {

}

export function movePointInsideBoundaries(point: Point, boundaries: Rectangle): Point {
	return {
		x: applyBoundariesToNumber(point.x, boundaries.x, boundaries.width),
		y: applyBoundariesToNumber(point.y, boundaries.y, boundaries.height),
	};
}
