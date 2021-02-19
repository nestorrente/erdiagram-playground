import {Ref, ref, watch} from 'vue';

export interface SelectInputOption<T> {
	text: string;
	value: T;
}

export default function useSelectInputOptions<T>(
		options: SelectInputOption<T>[],
		valueGetter: () => T,
		valueSetter: (newValue: T) => void
) {

	const selectedOption = ref(findOptionFromValue(valueGetter())) as Ref<SelectInputOption<T>>;

	watch(valueGetter, value => selectedOption.value = findOptionFromValue(value));
	watch(selectedOption, option => valueSetter(option.value));

	function findOptionFromValue(value: T) {
		return options.find(option => option.value === value)!;
	}

	return selectedOption;

}
