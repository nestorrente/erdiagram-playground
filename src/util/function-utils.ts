export function debounce(
		callback: (...args: any[]) => void,
		delayInMilliseconds: number
): (...args: any[]) => void {

	let timeoutId: number | undefined;

	return (...args: any[]) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => callback(...args), delayInMilliseconds);
	};

}
