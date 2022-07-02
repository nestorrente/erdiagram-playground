<template>
    <FileReadWrapper
            accept=".erd"
            :max-size="maxAllowedSize"
            :listen-keyboard-open-shortcut="!disableShortcutListener"
            @success="$emit('loadCode', $event)"
            @error="onOpenFileError"
            @max-size-error="onOpenFileMaxSizeError"
            #default="{openFile}"
    >
        <Button
                icon="far fa-folder-open"
                class="is-button-text-hidden-mobile"
                title="Load a model definition from your local computer (Ctrl + O)"
                @click="openFile"
        >
            Open file
        </Button>
    </FileReadWrapper>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Button from '@/components/generic/form/Button.vue';
    import {showErrorModalDialog} from '@/store/globalModalDialogStore';
    import FileReadWrapper from '@/components/generic/file/FileReadWrapper.vue';

    export default defineComponent({
        name: 'OpenInputCodeButton',
        emits: ['loadCode'],
        components: {
            FileReadWrapper,
            Button,
        },
        props: {
            disableShortcutListener: {
                type: Boolean,
                default: true
            }
        },
        setup() {

            const ONE_MEGABYTE_IN_BYTES = 1024 * 1024;

            const MAX_ALLOWED_SIZE = 10 * ONE_MEGABYTE_IN_BYTES;

            function onOpenFileError(error: any) {
                console.error('Cannot read file:', error);
                showErrorModalDialog('Cannot read file. Cause: ' + error);
            }

            function onOpenFileMaxSizeError(file: File) {

                const fileSizeInMegabytes = file.size / ONE_MEGABYTE_IN_BYTES;
                const formattedFileSize = fileSizeInMegabytes.toFixed(2);

                showErrorModalDialog(`File exceeds the maximum size allowed of 10 MB (file size: ${formattedFileSize} MB)`);

            }

            return {
                maxAllowedSize: MAX_ALLOWED_SIZE,
                onOpenFileError,
                onOpenFileMaxSizeError
            };

        }
    });
</script>
