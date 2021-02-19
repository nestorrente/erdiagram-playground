import {onBeforeUnmount, onMounted} from 'vue';

export default function useBeforeUnload(hasChanged: () => boolean) {

	const beforeUnloadHandler = () => {
		return hasChanged() ? 'Are you sure you want to exit? Changes you made will not be saved' : undefined;
	};

	let previousBeforeUnloadHandler: any = null;

	onMounted(() => {
		previousBeforeUnloadHandler = window.onbeforeunload;
		window.onbeforeunload = beforeUnloadHandler;
	});

	onBeforeUnmount(() => {
		window.onbeforeunload = previousBeforeUnloadHandler;
		previousBeforeUnloadHandler = null;
	});

}
