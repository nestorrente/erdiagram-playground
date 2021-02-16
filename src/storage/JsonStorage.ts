export default class JsonStorage {

	private readonly storage: Storage;

	private constructor(storage: Storage) {
		this.storage = storage;
	}

	get length(): number {
		return this.storage.length;
	}

	public clear(): void {
		this.storage.clear();
	}

	public getItem<T>(key: string): T | null {
		const value = this.storage.getItem(key);
		return value != null ? JSON.parse(value) : value;
	}

	public key(index: number): string | null {
		return this.storage.key(index);
	}

	public removeItem(key: string): void {
		this.storage.removeItem(key);
	}

	public setItem(key: string, value: any): void {
		this.storage.setItem(key, value != null ? JSON.stringify(value) : value);
	}

	public static wrap(storage: Storage): JsonStorage {
		return new JsonStorage(storage);
	}

}

export const sessionJsonStorage = JsonStorage.wrap(sessionStorage);
export const localJsonStorage = JsonStorage.wrap(localStorage);
