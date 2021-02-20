<template>
    <slot :download-file="downloadFile"></slot>
    <a
            ref="link"
            class="is-hidden"
            :download="fileName"
            :href="linkUrl"
    ></a>
</template>

<script lang="ts">
    import {defineComponent, nextTick, ref} from 'vue';
    import useDocumentEventListener from '@/composition/useDocumentEventListener';
    import {triggerClickEvent} from '@/util/dom-event-utils';

    interface Props {
        fileName: string;
        mimeType: string;
        fileContents: string | FileContentsSupplier;
        listenKeyboardSaveShortcut: boolean;
    }

    type FileContentsSupplier = () => string;

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
                required: true
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

                const fileData = new Blob(
                        [
                            getFileContents()
                        ],
                        {
                            type: props.mimeType
                        }
                );

                linkUrl.value = URL.createObjectURL(fileData);

                // Wait for Vue to update the "href" attribute
                nextTick(() => {
                    triggerClickEvent(link.value!);
                    URL.revokeObjectURL(linkUrl.value!);
                    linkUrl.value = undefined;
                });

            }

            function getFileContents(): string {

                const {fileContents} = props;

                if (typeof fileContents === 'function') {
                    return fileContents();
                } else {
                    return fileContents;
                }

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
