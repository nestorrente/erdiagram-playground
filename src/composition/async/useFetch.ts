import {ComputedRef} from 'vue';
import {Nullable} from '@/util/util-types';
import useAsyncOperation, {
	UseAsyncOperationOptions,
	UseAsyncOperationResult
} from '@/composition/async/useAsyncOperation';

export type UrlGetter = () => Nullable<string>;

export type ResponseDataExtractor<T> = (response: Response) => Promise<T>;

export interface UseFetchOptions extends UseAsyncOperationOptions {
	fetchInit: RequestInit;
}

export interface UseFetchResult<T, E> {
	data: ComputedRef<T | undefined>;
	error: ComputedRef<E | undefined>;
	loading: ComputedRef<boolean>;
}

export default function useFetch<T, E = any>(
		urlGetter: UrlGetter,
		responseDataExtractor: ResponseDataExtractor<T>,
		options: Partial<UseFetchOptions> = {}
): UseAsyncOperationResult<T, E> {

	return useAsyncOperation<T, E>(() => {

		const url = urlGetter();

		if (url == null) {
			return null;
		}

		return fetch(url, options.fetchInit).then(responseDataExtractor);

	}, options);

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
