import {PromiseOrResult} from '@/util/util-types';

export type FileContents = Blob | string | undefined;
export type FileContentsOrPromise = PromiseOrResult<FileContents>;

export type FileContentsSupplier = () => FileContentsOrPromise;
