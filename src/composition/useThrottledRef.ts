import {nextTick, ref, watch} from 'vue';
import {throttle} from '@/util/function-utils';

export function useThrottledRef<T>(initialValue: T, delayInMilliseconds: number) {

	const liveRef = ref(initialValue);
	const throttledRef = ref(initialValue);
	const synced = ref(true);

	let updatingLiveRef = false;
	let updatingThrottledRef = false;

	watch(throttledRef, newValue => {

		if (updatingThrottledRef) {
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
		updateThrottledRefCallback(newValue);

	});

	const updateThrottledRefCallback = throttle(newValue => {

		if (synced.value) {
			return;
		}

		updatingThrottledRef = true;

		try {
			throttledRef.value = newValue;
			synced.value = true;
		} finally {
			nextTick(() => updatingThrottledRef = false);
		}

	}, delayInMilliseconds);

	return {
		liveRef,
		throttledRef,
		synced
	};

}
