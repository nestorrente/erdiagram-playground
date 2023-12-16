import {createStore} from '@/store/util/createStore';
import {reactive, ref, toRefs} from 'vue';
import {copyProperties} from '@/util/object-utils';

export interface GlobalModalDialogOptions {
	headerClass: string | string[] | undefined;
	titleClass: string | string[] | undefined;
	titleIcon: string | undefined;
	title: string;
	message: string;
	acceptButton: GlobalModalDialogButton | undefined;
	cancelButton: GlobalModalDialogButton | undefined;
}

export interface GlobalModalDialogButton {
	text: string;
	color?: string;
}

type AnswerCallback = (answer: boolean) => void;
const noopAnswerCallback: AnswerCallback = () => undefined;

const globalModalDialogStore = createStore(() => {

	const showing = ref(false);

	const optionsState = reactive<GlobalModalDialogOptions>({
		headerClass: undefined,
		titleClass: undefined,
		titleIcon: undefined,
		title: '',
		message: '',
		acceptButton: undefined,
		cancelButton: undefined,
	});

	const answerCallback = ref(noopAnswerCallback);

	function show(options: GlobalModalDialogOptions) {

		copyProperties(options, optionsState);

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
		...toRefs(optionsState),
		show,
		accept,
		cancel
	};

});

export default globalModalDialogStore;

export interface ConfirmModalOptions {
	title?: string;
	message: string;
	acceptButtonText?: string;
	acceptButtonColor?: string;
	cancelButtonText?: string;
	cancelButtonColor?: string;
}

export function showConfirmModalDialog(optionsOrMessage: ConfirmModalOptions | string) {

	const options: ConfirmModalOptions = typeof optionsOrMessage === 'string'
			? {message: optionsOrMessage}
			: optionsOrMessage;

	return globalModalDialogStore.show({
		headerClass: undefined,
		titleClass: undefined,
		titleIcon: 'far fa-question-circle',
		title: 'Confirm',
		acceptButton: {
			text: 'Accept',
			color: 'danger'
		},
		cancelButton: {
			text: 'Cancel'
		},
		...options
	});

}

export interface ErrorModalOptions {
	title?: string;
	message: string;
	acceptButtonText?: string;
	acceptButtonColor?: string;
}

export function showErrorModalDialog(optionsOrMessage: ErrorModalOptions | string) {

	const options: ErrorModalOptions = typeof optionsOrMessage === 'string'
			? {message: optionsOrMessage}
			: optionsOrMessage;

	return globalModalDialogStore.show({
		headerClass: 'has-background-danger',
		titleClass: 'has-text-white',
		titleIcon: 'fas fa-exclamation-circle',
		title: 'Error',
		acceptButton: {
			text: 'Accept'
		},
		cancelButton: undefined,
		...options
	});

}
