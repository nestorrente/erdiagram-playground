<template>
    <slot :download-file="downloadFile"></slot>
    <teleport to="body">
        <a
                ref="link"
                class="is-hidden"
                :download="fileName"
                :href="linkUrl"
        ></a>
    </teleport>
</template>

<script lang="ts">
    import {defineComponent, nextTick, ref} from 'vue';
    import {useDocumentEventListener} from '@/composition/event/useEventListener';
    import {triggerClickEvent} from '@/util/dom-event-utils';
    import {FileContents, FileContentsOrPromise, FileContentsSupplier} from '@/components/generic/file/types';

    interface Props {
        fileName: string;
        mimeType: string;
        fileContents?: FileContents | FileContentsSupplier;
        listenKeyboardSaveShortcut: boolean;
    }

    export default defineComponent({
        name: 'FileDownloadWrapper',
        emits: ['loading', 'success', 'error', 'maxSizeError'],
        props: {
            fileName: {
                type: String,
                required: true
            },
            mimeType: {
                type: String,
                default: 'text/plain'
            },
            fileContents: {
                type: [String, Function],
                required: false
            },
            listenKeyboardSaveShortcut: {
                type: Boolean,
                default: false
            }
        },
        setup(uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const link = ref<HTMLAnchorElement>();
            const linkUrl = ref<string>();

            function downloadFile() {
                Promise.resolve(getFileContentsOrPromise())
                        .then(fileContents => downloadFileContents(fileContents));
                // TODO manage error?
            }

            function getFileContentsOrPromise(): FileContentsOrPromise {

                const {fileContents} = props;

                if (typeof fileContents === 'function') {
                    return fileContents();
                } else {
                    return fileContents;
                }

            }

            function downloadFileContents(fileContents: Blob | string | undefined) {

                if (!fileContents) {
                    return;
                }

                const blob = createBlobFromFileContents(fileContents);

                linkUrl.value = URL.createObjectURL(blob);

                // Wait for Vue to update the "href" attribute
                nextTick(() => {
                    triggerClickEvent(link.value!);
                    URL.revokeObjectURL(linkUrl.value!);
                    linkUrl.value = undefined;
                });

            }

            function createBlobFromFileContents(fileContents: NonNullable<FileContents>): Blob {

                if (fileContents instanceof Blob) {
                    return fileContents;
                }

                return new Blob([fileContents], {
                    type: props.mimeType
                });

            }

            useDocumentEventListener('keydown', (event: KeyboardEvent) => {
                if (props.listenKeyboardSaveShortcut && event.ctrlKey && event.key === 's') {
                    event.preventDefault();
                    downloadFile();
                }
            });

            return {
                link,
                linkUrl,
                downloadFile
            };

        }
    });
</script>
