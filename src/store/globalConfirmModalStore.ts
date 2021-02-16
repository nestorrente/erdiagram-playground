import {createStore} from '@/store/util/createStore';
import {ref} from 'vue';

export interface ShowOptions {
	title: string;
	message: string;
	acceptButton: boolean;
	acceptButtonText?: string;
	acceptButtonColor?: string;
	cancelButton: boolean;
	cancelButtonText?: string;
	cancelButtonColor?: string;
}

type AnswerCallback = (answer: boolean) => void;
const noopAnswerCallback: AnswerCallback = () => undefined;

const globalConfirmModalStore = createStore(() => {

	const defaultShowOptions: Partial<ShowOptions> = {
		acceptButton: true,
		acceptButtonText: 'Accept',
		cancelButton: true,
		cancelButtonText: 'Cancel'
	};

	const showing = ref(false);

	const title = ref(defaultShowOptions.title);
	const message = ref(defaultShowOptions.message);
	const acceptButton = ref(defaultShowOptions.acceptButton);
	const acceptButtonText = ref(defaultShowOptions.acceptButtonText);
	const acceptButtonColor = ref(defaultShowOptions.acceptButtonColor);
	const cancelButton = ref(defaultShowOptions.cancelButton);
	const cancelButtonText = ref(defaultShowOptions.cancelButtonText);
	const cancelButtonColor = ref(defaultShowOptions.cancelButtonColor);

	const answerCallback = ref(noopAnswerCallback);

	function show(options: ShowOptions) {

		const fullOptions: ShowOptions = {
			...defaultShowOptions,
			...options
		};

		title.value = fullOptions.title;
		message.value = fullOptions.message;
		console.log('Options:', fullOptions);
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
		message,
		acceptButton,
		acceptButtonText,
		acceptButtonColor,
		cancelButton,
		cancelButtonText,
		cancelButtonColor,
		show,
		accept,
		cancel
	};

});

export default globalConfirmModalStore;

export function showConfirmModal(options?: Partial<ShowOptions>) {
	return globalConfirmModalStore.show({
		title: 'Confirm',
		message: 'Are you sure you want to continue?',
		acceptButton: true,
		acceptButtonText: 'Accept',
		acceptButtonColor: 'danger',
		cancelButton: true,
		cancelButtonText: 'Cancel',
		...options
	});
}

export interface AlertModalOptions extends Partial<ShowOptions> {
	message: string;
}

export function showAlertModal(options: AlertModalOptions) {
	return globalConfirmModalStore.show({
		title: 'Information',
		acceptButton: true,
		acceptButtonText: 'Accept',
		acceptButtonColor: 'primary',
		cancelButton: false,
		...options
	});
}
