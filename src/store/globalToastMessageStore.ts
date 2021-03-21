import {createStore} from '@/store/util/createStore';
import {computed, reactive} from 'vue';

export enum ToastMessageType {
	SUCCESS = 'success',
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error'
}

export interface ToastMessageOptions {
	duration: number;
	maxWidth: number;
}

export interface ToastMessage {
	uuid: number;
	type: ToastMessageType;
	message: string;
	maxWidth: number;
}

const DEFAULT_TOAST_MESSAGE_OPTIONS: ToastMessageOptions = {
	duration: 2000,
	maxWidth: 400
};

const globalToastMessageStore = createStore(() => {

	let nextToastMessageUUID = 1;

	const state = reactive({
		toastMessages: [] as ToastMessage[]
	});

	function showToastMessage(message: string, type: ToastMessageType, options?: Partial<ToastMessageOptions>) {

		const {
			duration,
			maxWidth
		} = {
			...DEFAULT_TOAST_MESSAGE_OPTIONS,
			...options
		};

		const toastMessage: ToastMessage = {
			uuid: nextToastMessageUUID++,
			type: type,
			message: message,
			maxWidth: maxWidth
		};

		state.toastMessages.push(toastMessage);

		setTimeout(() => {
			const index = state.toastMessages.indexOf(toastMessage);
			state.toastMessages.splice(index, 1);
		}, duration);

	}

	return {
		toastMessages: computed(() => state.toastMessages),
		showToastMessage
	};

});

export default globalToastMessageStore;

export function showSuccessToastMessage(message: string, options?: Partial<ToastMessageOptions>) {
	globalToastMessageStore.showToastMessage(message, ToastMessageType.SUCCESS, options);
}

export function showInfoToastMessage(message: string, options?: Partial<ToastMessageOptions>) {
	globalToastMessageStore.showToastMessage(message, ToastMessageType.INFO, options);
}

export function showWarningToastMessage(message: string, options?: Partial<ToastMessageOptions>) {
	globalToastMessageStore.showToastMessage(message, ToastMessageType.WARNING, options);
}

export function showErrorToastMessage(message: string, options?: Partial<ToastMessageOptions>) {
	globalToastMessageStore.showToastMessage(message, ToastMessageType.ERROR, options);
}
