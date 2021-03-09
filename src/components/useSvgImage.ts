import {computed} from 'vue';
import {UseFetchResult, useTextFetch} from '@/components/useFetch';

export interface UseSvgImageProps {
	svgCode?: string;
	svgUrl?: string;
}

export type UseSvgImageResult<E> = UseFetchResult<string, E>;

export default function useSvgImage<E = any>(props: UseSvgImageProps): UseSvgImageResult<E> {

	const computedUrl = computed(() => {
		return props.svgCode != null ? null : props.svgUrl;
	});

	const {
		data: fetchData,
		error: fetchError,
		loading: fetchLoading
	} = useTextFetch(() => computedUrl.value);

	const computedSvgCode = computed(() => {
		if (props.svgUrl != null) {
			return fetchData.value;
		} else {
			return props.svgCode;
		}
	});

	return {
		data: computedSvgCode,
		error: fetchError,
		loading: fetchLoading
	};

}
