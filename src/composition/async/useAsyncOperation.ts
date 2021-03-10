import {computed, ComputedRef, ref, watch} from 'vue';
import {Nullable} from '@/util/util-types';

type AsyncOperation<T> = () => Nullable<Promise<T>>;

export interface UseAsyncOperationOptions {
	keepPreviousResultWhileLoading: boolean;
}

const DEFAULT_ASYNC_OPERATION_OPTIONS: UseAsyncOperationOptions = {
	keepPreviousResultWhileLoading: false
};

export interface UseAsyncOperationResult<T, E> {
	data: ComputedRef<T | undefined>;
	error: ComputedRef<E | undefined>;
	loading: ComputedRef<boolean>;
}

let nextFetchUUID = 1;

export default function useAsyncOperation<T, E = any>(
		asyncOperationGetter: AsyncOperation<T>,
		options?: Partial<UseAsyncOperationOptions>
): UseAsyncOperationResult<T, E> {

	const data = ref<T>();
	const error = ref<E>();
	const loading = ref(false);

	let lastFetchUUID: Nullable<number> = null;

	watch(asyncOperationGetter, async asyncOperationResult => {

		if (asyncOperationResult == null) {
			lastFetchUUID = null;
			data.value = undefined;
			error.value = undefined;
			loading.value = false;
			return;
		}

		const currentFetchUUID = nextFetchUUID++;
		lastFetchUUID = currentFetchUUID;

		const fullOptions = {...DEFAULT_ASYNC_OPERATION_OPTIONS, ...options};

		const {
			keepPreviousResultWhileLoading
		} = fullOptions;

		loading.value = true;

		if (!keepPreviousResultWhileLoading) {
			data.value = undefined;
			error.value = undefined;
		}

		asyncOperationResult
				.then(result => {
					if (currentFetchUUID === lastFetchUUID) {
						data.value = result;
					}
				})
				.catch(e => {
					if (currentFetchUUID === lastFetchUUID) {
						error.value = e;
					}
				})
				.finally(() => {
					if (currentFetchUUID === lastFetchUUID) {
						loading.value = false;
					}
				});

	}, {immediate: true});

	return {
		data: computed(() => data.value),
		error: computed(() => error.value),
		loading: computed(() => loading.value)
	};

}
