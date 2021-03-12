<template>
    <slot :open-file="openFile"></slot>
    <input
            ref="fileInput"
            type="file"
            class="is-hidden"
            :accept="accept"
            @change="onFileInputChange"
    >
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import {useDocumentEventListener} from '@/composition/event/useEventListener';

    interface Props {
        accept?: string;
        maxSize?: number;
        listenKeyboardOpenShortcut: boolean;
    }

    export default defineComponent({
        name: 'FileReadWrapper',
        emits: ['loading', 'success', 'error', 'maxSizeError'],
        props: {
            accept: String,
            maxSize: Number,
            listenKeyboardOpenShortcut: Boolean
        },
        setup(uncastedProps, context) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const fileInput = ref<HTMLInputElement>();

            function openFile() {
                fileInput.value!.click();
            }

            function onFileInputChange() {

                const fileInputElement = fileInput.value!;

                const files = fileInputElement.files;

                if (files?.length !== 1) {
                    return;
                }

                readFile(files[0]!);

                // Reset input
                fileInputElement.value = '';

            }

            function readFile(file: File) {

                if (props.maxSize != null && props.maxSize < file.size) {
                    context.emit('maxSizeError', file);
                    return;
                }

                context.emit('loading', file);

                const fileReader = new FileReader();

                fileReader.addEventListener('load', () => {
                    context.emit('success', fileReader.result, file);
                });

                fileReader.addEventListener('error', () => {
                    context.emit('error', fileReader.error, file);
                });

                fileReader.readAsText(file);

            }

            useDocumentEventListener('keydown', (event: KeyboardEvent) => {
                if (props.listenKeyboardOpenShortcut && event.ctrlKey && event.key === 'o') {
                    event.preventDefault();
                    openFile();
                }
            });

            return {
                fileInput,
                openFile,
                onFileInputChange
            };

        }
    });
</script>
