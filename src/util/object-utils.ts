export function copyProperties<T extends Record<string, any>>(source: Partial<T>, target: T) {
	Object.entries(source).forEach(([key, value]: [keyof T, T[keyof T]]) => {
		target[key] = value;
	});
}
