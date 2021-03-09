import {computed, ComputedRef, ref, watch} from 'vue';

export type UrlGetter = () => string | undefined | null;

export type ResponseDataExtractor<T> = (response: Response) => Promise<T>;

export interface UseFetchOptions {
	fetchInit?: RequestInit;
	keepPreviousResultWhileLoading: boolean;
}

const DEFAULT_FETCH_OPTIONS: UseFetchOptions = {
	keepPreviousResultWhileLoading: false
};

export interface UseFetchResult<T, E> {
	data: ComputedRef<T | undefined>;
	error: ComputedRef<E | undefined>;
	loading: ComputedRef<boolean>;
}

let nextFetchUUID = 1;

export default function useFetch<T, E = any>(
		urlGetter: UrlGetter,
		responseDataExtractor: ResponseDataExtractor<T>,
		options: UseFetchOptions = DEFAULT_FETCH_OPTIONS
): UseFetchResult<T, E> {

	const data = ref<T>();
	const error = ref<E>();
	const loading = ref(false);

	let lastFetchUUID: number | null = null;

	watch(urlGetter, async url => {

		if (url == null) {
			lastFetchUUID = null;
			data.value = undefined;
			error.value = undefined;
			loading.value = false;
			return;
		}

		const currentFetchUUID = nextFetchUUID++;
		lastFetchUUID = currentFetchUUID;

		const {
			fetchInit,
			keepPreviousResultWhileLoading
		} = options;

		loading.value = true;

		if (!keepPreviousResultWhileLoading) {
			data.value = undefined;
			error.value = undefined;
		}

		fetch(url, fetchInit)
				.then(responseDataExtractor)
				.then(response => {
					if (currentFetchUUID === lastFetchUUID) {
						data.value = response;
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

export function useTextFetch<E = any>(urlGetter: UrlGetter, options?: UseFetchOptions): UseFetchResult<string, E> {
	return useFetch(urlGetter, response => response.text(), options);
}

export function useJsonFetch<T, E = any>(urlGetter: UrlGetter, options?: UseFetchOptions): UseFetchResult<T, E> {
	return useFetch(urlGetter, response => response.json(), options);
}

export function useBlobFetch<E = any>(urlGetter: UrlGetter, options?: UseFetchOptions): UseFetchResult<Blob, E> {
	return useFetch(urlGetter, response => response.blob(), options);
}
