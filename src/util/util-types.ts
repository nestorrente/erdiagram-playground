export type Nullable<T> = T | null | undefined;
export type PromiseOrResult<T> = T | Promise<T>;
export type StringKeyOf<T> = string & keyof T;
