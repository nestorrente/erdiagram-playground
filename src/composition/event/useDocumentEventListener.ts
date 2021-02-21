import {onBeforeUnmount, onMounted} from 'vue';

export default function useDocumentEventListener(type: string, handler: (event: any) => void) {
	onMounted(() => document.addEventListener(type, handler));
	onBeforeUnmount(() => document.removeEventListener(type, handler));
}