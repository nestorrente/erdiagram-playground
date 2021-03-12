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

export interface Rectangle extends Point, Dimension {

}

export function getCenterPoint(dimensionOrRectangle: Dimension | Rectangle): Point {

	const x = 'x' in dimensionOrRectangle ? dimensionOrRectangle.x : 0;
	const y = 'y' in dimensionOrRectangle ? dimensionOrRectangle.y : 0;

	return {
		x: Big(x).plus(dimensionOrRectangle.width).div(2).toNumber(),
		y: Big(y).plus(dimensionOrRectangle.height).div(2).toNumber()
	};

}

export function getEnclosingRectangle(...rectangles: Rectangle[]): Rectangle {

	if (rectangles.length === 0) {
		return {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
	}

	let minX = Infinity;
	let minY = Infinity;

	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const rectangle of rectangles) {

		const {x, y, width, height} = rectangle;

		if (x < minX) {
			minX = x;
		}

		if (y < minY) {
			minY = y;
		}

		if (x + width > maxX) {
			maxX = x + width;
		}

		if (y + height > maxY) {
			maxY = y + height;
		}

	}

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
	};

}
