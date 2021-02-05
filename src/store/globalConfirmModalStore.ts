import {createStore} from '@/store/util/createStore';
import {ref} from 'vue';

export interface ShowOptions {
	title: string;
	acceptButton: boolean;
	acceptButtonText: string;
	cancelButton: boolean;
	cancelButtonText: string;
}

type AnswerCallback = (answer: boolean) => void;
const noopAnswerCallback: AnswerCallback = () => undefined;

const globalConfirmModalStore = createStore(() => {

	const defaultShowOptions: ShowOptions = {
		title: 'Confirm',
		acceptButton: true,
		acceptButtonText: 'Accept',
		cancelButton: true,
		cancelButtonText: 'Cancel'
	};

	const showing = ref(false);

	const title = ref(defaultShowOptions.title);
	const acceptButton = ref(defaultShowOptions.acceptButton);
	const acceptButtonText = ref(defaultShowOptions.acceptButtonText);
	const cancelButton = ref(defaultShowOptions.cancelButton);
	const cancelButtonText = ref(defaultShowOptions.cancelButtonText);

	const answerCallback = ref(noopAnswerCallback);

	function show(options?: Partial<ShowOptions>) {

		const fullOptions: ShowOptions = {
			...defaultShowOptions,
			...options
		};

		title.value = fullOptions.title;
		acceptButton.value = fullOptions.acceptButton;
		acceptButtonText.value = fullOptions.acceptButtonText;
		cancelButton.value = fullOptions.cancelButton;
		cancelButtonText.value = fullOptions.cancelButtonText;

		showing.value = true;

		return new Promise((resolve) => {
			answerCallback.value = resolve;
		});

	}

	function accept() {
		invokeAnswerCallbackAndClose(true);
	}

	function cancel() {
		invokeAnswerCallbackAndClose(false);
	}

	function invokeAnswerCallbackAndClose(answer: boolean) {

		const answerCallbackValue = answerCallback.value;
		answerCallbackValue(answer);

		close();

	}

	function close() {
		answerCallback.value = noopAnswerCallback;
		showing.value = false;
	}

	return {
		showing,
		title,
		acceptButton,
		acceptButtonText,
		cancelButton,
		cancelButtonText,
		show,
		accept,
		cancel
	};

});

export default globalConfirmModalStore;

export function showConfirmModal(options?: Partial<ShowOptions>) {
	return globalConfirmModalStore.show(options);
}
