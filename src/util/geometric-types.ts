export interface Point {
	x: number;
	y: number;
}

export interface Point3D extends Point {
	z: number;
}

export interface Dimension {
	width: number;
	height: number;
}

export function addPoints(pointA: Point, pointB: Point): Point {
	return {
		x: pointA.x + pointB.x,
		y: pointA.y + pointB.y
	};
}

export function substractPoints(pointA: Point, pointB: Point): Point {
	return {
		x: pointA.x - pointB.x,
		y: pointA.y - pointB.y
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
