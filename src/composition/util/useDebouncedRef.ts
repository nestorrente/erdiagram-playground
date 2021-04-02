import {nextTick, ref, watch} from 'vue';
import debounce from 'lodash.debounce';

export default function useDebouncedRef<T>(initialValue: T, delayInMilliseconds: number) {

	const liveRef = ref(initialValue);
	const debouncedRef = ref(initialValue);
	const synced = ref(true);

	let updatingLiveRef = false;
	let updatingDebouncedRef = false;

	watch(debouncedRef, newValue => {

		if (updatingDebouncedRef) {
			return;
		}

		updatingLiveRef = true;

		try {
			liveRef.value = newValue;
			synced.value = true;
		} finally {
			nextTick(() => updatingLiveRef = false);
		}

	});

	watch(liveRef, newValue => {

		if (updatingLiveRef) {
			return;
		}

		synced.value = false;
		updateDebouncedRefCallback(newValue);

	});

	const updateDebouncedRefCallback = debounce(newValue => {

		if (synced.value) {
			return;
		}

		updatingDebouncedRef = true;

		try {
			debouncedRef.value = newValue;
			synced.value = true;
		} finally {
			nextTick(() => updatingDebouncedRef = false);
		}

	}, delayInMilliseconds);

	return {
		liveRef,
		debouncedRef,
		synced
	};

}
