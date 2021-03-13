import Big from 'big.js';

export interface Point {
	x: number;
	y: number;
}

export interface Point3D extends Point {
	z: number;
}

export function addPoints(pointA: Point, pointB: Point): Point {
	return {
		x: Big(pointA.x).plus(pointB.x).toNumber(),
		y: Big(pointA.y).plus(pointB.y).toNumber()
	};
}

export function substractPoints(pointA: Point, pointB: Point): Point {
	return {
		x: Big(pointA.x).minus(pointB.x).toNumber(),
		y: Big(pointA.y).minus(pointB.y).toNumber()
	};
}

export function scalePoint(point: Point, scale: number): Point {
	return {
		x: Big(point.x).times(scale).toNumber(),
		y: Big(point.y).times(scale).toNumber()
	};
}

export function unscalePoint(point: Point, scale: number): Point {
	return {
		x: Big(point.x).div(scale).toNumber(),
		y: Big(point.y).div(scale).toNumber()
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

export function substractDimension(dimensionA: Dimension, dimensionB: Dimension): Dimension {
	return {
		width: dimensionA.width - dimensionB.width,
		height: dimensionA.height - dimensionB.height
	};
}

export function scaleDimension(dimension: Dimension, scale: number): Dimension {
	return {
		width: Big(dimension.width).times(scale).toNumber(),
		height: Big(dimension.height).times(scale).toNumber()
	};
}

export function unscaleDimension(dimension: Dimension, scale: number): Dimension {
	return {
		width: Big(dimension.width).div(scale).toNumber(),
		height: Big(dimension.height).div(scale).toNumber()
	};
}

export function getDimensionCenterPoint(dimensionOrRectangle: Dimension): Point {
	return {
		x: Big(dimensionOrRectangle.width).div(2).toNumber(),
		y: Big(dimensionOrRectangle.height).div(2).toNumber()
	};
}

export interface Rectangle extends Dimension, Point {

}
