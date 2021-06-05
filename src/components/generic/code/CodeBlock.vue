<template>
    <div
            class="is-relative"
            :class="{'is-full-height': fullHeight}"
    >

        <div
                class="buttons-toolbar"
                :style="{
                    '--scrollbar-size': `${codeBlockScrollbarsSize.vertical}px`
                }"
        >
            <Button
                    color="warning"
                    small
                    :icon="copiedState ? 'fas fa-clipboard-check' : 'fas fa-clipboard'"
                    class="copy-button"
                    :disabled="!code"
                    @click="copyCode"
                    @mouseleave="copiedState = false"
            >
                {{ copiedState ? 'Copied!' : 'Copy' }}
            </Button>

            <FileDownloadWrapper
                    v-if="downloadFilename"
                    :file-name="downloadFilename"
                    :file-contents="getFileContentsToDownload"
                    #default="{downloadFile}"
            >
                <Button
                        color="default"
                        small
                        icon="fas fa-download"
                        class="download-button"
                        :disabled="!code"
                        @click="downloadFile"
                >
                </Button>
            </FileDownloadWrapper>
        </div>

        <pre
                class="code-container"
                :class="{
                    'has-white-space-pre-wrap': wrap,
                    'is-full-height': fullHeight
                }"
        ><code
                ref="codeBlock"
                :class="[lang, customCodeClass, {'is-full-height': fullHeight}]"
                v-text="code"
        ></code></pre>

    </div>
</template>

<script lang="ts">
    import {defineComponent, onMounted, onUpdated, ref} from 'vue';
    import hljs from 'highlight.js';
    import useElementScrollbarsSize from '@/composition/dom/size/useElementScrollbarsSize';
    import Button from '@/components/generic/form/Button.vue';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';

    export default defineComponent({
        name: 'CodeBlock',
        components: {FileDownloadWrapper, Button},
        props: {
            lang: {
                type: String,
                default: 'plaintext'
            },
            code: {
                type: String,
                required: true
            },
            wrap: {
                type: Boolean,
                default: false
            },
            fullHeight: {
                type: Boolean,
                default: false
            },
            customCodeClass: {
                type: String,
                required: false
            },
            downloadFilename: {
                type: String,
                required: false
            },
            downloadCallback: {
                type: Function,
                required: false
            }
        },
        setup(props) {

            const codeBlock = ref<HTMLElement>();

            onMounted(applyHighlights);
            onUpdated(applyHighlights);

            function applyHighlights() {
                hljs.highlightElement(codeBlock.value!);
            }

            const copiedState = ref(false);

            function copyCode() {
                navigator.clipboard.writeText(props.code);
                copiedState.value = true;
            }

            const codeBlockScrollbarsSize = useElementScrollbarsSize(codeBlock);

            function getFileContentsToDownload(): string {
                if (props.downloadCallback) {
                    return props.downloadCallback();
                }
                return props.code;
            }

            return {
                codeBlock,
                copyCode,
                copiedState,
                codeBlockScrollbarsSize,
                getFileContentsToDownload
            };

        }
    });
</script>

<style lang="scss">
    .code-container {
        border-radius: 4px;
        overflow: hidden;
        padding: 0;

        > code {
            padding: 1.25em;
        }
    }

    .buttons-toolbar {

        position: absolute;

        top: 1em;
        right: calc(1em + var(--scrollbar-size));

        button + button {
            margin-left: 1em;
        }

        > button {

            transition: opacity ease-in-out 0.15s;

            &:not(:hover) {
                opacity: 0.5;
            }

        }

        > .copy-button > .button-text {
            width: 3em;
        }

    }
</style>
