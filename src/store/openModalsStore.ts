import {createStore} from '@/store/util/createStore';
import {computed, ref} from 'vue';

const openModalsStore = createStore(() => {

	const openModalUidStack = ref<number[]>([]);

	function registerModalOpen(modalUID: number) {
		openModalUidStack.value.push(modalUID);
	}

	function registerModalClose(modalUID: number) {

		const index = openModalUidStack.value.indexOf(modalUID);

		if (index !== -1) {
			openModalUidStack.value.splice(index, 1);
		}

	}

	const frontModalUid = computed((): number | undefined => {
		return openModalUidStack.value[openModalUidStack.value.length - 1];
	});

	return {
		registerModalOpen,
		registerModalClose,
		frontModalUid
	};

});

export default openModalsStore;
