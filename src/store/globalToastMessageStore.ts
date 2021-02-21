import {createStore} from '@/store/util/createStore';
import {computed, reactive} from 'vue';

export enum ToastMessageType {
	SUCCESS = 'success',
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error'
}

export interface ToastMessageOptions {
	type: ToastMessageType;
	message: string;
	duration?: number;
}

export interface ToastMessage {
	uuid: number;
	type: ToastMessageType;
	message: string;
}

const DEFAULT_TOAST_DURATION = 2000;

const globalToastMessageStore = createStore(() => {

	let nextToastMessageUUID = 1;

	const state = reactive({
		toastMessages: [] as ToastMessage[]
	});

	function showToastMessage(options: ToastMessageOptions) {

		const toastMessage: ToastMessage = {
			uuid: nextToastMessageUUID++,
			type: options.type,
			message: options.message
		};

		const duration = options.duration ?? DEFAULT_TOAST_DURATION;

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

export function showSuccessToastMessage(message: string, duration?: number) {
	globalToastMessageStore.showToastMessage({
		type: ToastMessageType.SUCCESS,
		message,
		duration
	});
}

export function showInfoToastMessage(message: string, duration?: number) {
	globalToastMessageStore.showToastMessage({
		type: ToastMessageType.INFO,
		message,
		duration
	});
}

export function showWarningToastMessage(message: string, duration?: number) {
	globalToastMessageStore.showToastMessage({
		type: ToastMessageType.WARNING,
		message,
		duration
	});
}

export function showErrorToastMessage(message: string, duration?: number) {
	globalToastMessageStore.showToastMessage({
		type: ToastMessageType.ERROR,
		message,
		duration
	});
}
