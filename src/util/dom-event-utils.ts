export function triggerClickEvent(element: HTMLElement) {

	const clickEvent = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});

	element.dispatchEvent(clickEvent);

}
