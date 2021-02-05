import {reactive, shallowReactive, shallowReadonly} from 'vue';

export function createStore<T extends object>(setup: StoreSetup<T>) {
	return shallowReadonly(reactive(setup()));
}

export function createShallowStore<T extends object>(setup: StoreSetup<T>) {
	return shallowReadonly(shallowReactive(setup()));
}

export type StoreSetup<T extends object> = () => T;
