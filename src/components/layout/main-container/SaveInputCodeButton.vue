<template>
    <FileDownloadWrapper
            file-name="ER_model.erd"
            :file-contents="inputCode"
            :listen-keyboard-save-shortcut="!disableShortcutListener"
            #default="{downloadFile}"
    >
        <Button
                icon="far fa-save"
                class="is-button-text-hidden-mobile"
                title="Save the current model definition to your local computer (Ctrl + S)"
                @click="downloadFile"
        >
            Save file
        </Button>
    </FileDownloadWrapper>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Button from '@/components/generic/form/Button.vue';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';

    export default defineComponent({
        name: 'SaveInputCodeButton',
        components: {
            FileDownloadWrapper,
            Button,
        },
        props: {
            inputCode: {
                type: String,
                required: true
            },
            disableShortcutListener: {
                type: Boolean,
                default: true
            }
        }
    });
</script>
