import {ref, Ref, SetupContext, watch} from 'vue';

export default function useControllablePropRef<P, K extends keyof P>(
		props: P,
		propName: K,
		context: SetupContext
): Ref<P[K]> {

	const updateEventName = 'update:' + propName;

	const propRef = ref(props[propName]) as Ref<P[K]>;

	watch(() => props[propName], value => propRef.value = value);
	watch(propRef, value => context.emit(updateEventName, value));

	return propRef;

}
