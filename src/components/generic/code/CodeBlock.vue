<template>
    <div
            class="is-relative"
            :class="{'is-full-height': fullHeight}"
    >

        <Button
                color="warning"
                small
                :outlined="copiedState"
                :icon="copiedState ? 'fas fa-clipboard-check' : 'fas fa-clipboard'"
                class="copy-button"
                :style="{
                    '--scrollbar-size': `${codeBlockScrollbarsSize.vertical}px`
                }"
                @click="copyCode"
                @mouseleave="copiedState = false"
        >
            {{ copiedState ? 'Copied!' : 'Copy' }}
        </Button>

        <pre
                class="code-container"
                :class="{'is-full-height': fullHeight}"
        ><code
                ref="codeBlock"
                :class="[lang, {'is-full-height': fullHeight}]"
                v-text="code"
        ></code></pre>

    </div>
</template>

<script lang="ts">
    import {defineComponent, onMounted, onUpdated, ref} from 'vue';
    import hljs from 'highlight.js';
    import useElementScrollbarsSize from '@/composition/useElementScrollbarsSize';
    import Button from '@/components/generic/form/Button.vue';

    export default defineComponent({
        name: 'CodeBlock',
        components: {Button},
        props: {
            lang: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            },
            fullHeight: {
                type: Boolean,
                default: false
            }
        },
        setup(props) {

            const codeBlock = ref<HTMLElement>();

            onMounted(applyHighlights);
            onUpdated(applyHighlights);

            function applyHighlights() {
                hljs.highlightBlock(codeBlock.value!);
            }

            const copiedState = ref(false);

            function copyCode() {
                navigator.clipboard.writeText(props.code);
                copiedState.value = true;
            }

            const codeBlockScrollbarsSize = useElementScrollbarsSize(codeBlock);

            return {
                codeBlock,
                copyCode,
                copiedState,
                codeBlockScrollbarsSize
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

    .copy-button {

        position: absolute;

        top: 1em;
        right: calc(1em + var(--scrollbar-size));

        > .button-text {
            width: 3em;
        }

        transition: opacity ease-in-out 0.15s;

        &:not(:hover) {
            opacity: 0.5;
        }

    }
</style>
