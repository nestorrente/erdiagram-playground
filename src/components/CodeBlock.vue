<template>
    <div
            class="is-relative"
            :class="{'is-full-height': fullHeight}"
    >

        <button
                class="button is-small is-warning copy-button"
                :class="{'is-outlined': copiedState}"
                :style="{
                    '--scrollbar-size': `${codeBlockScrollbarsSize.vertical}px`
                }"
                @click="copyCode"
                @mouseleave="copiedState = false"
        >
            <span class="icon">
                <i :class="{
                    'fas fa-clipboard': !copiedState,
                    'fas fa-clipboard-check': copiedState
                }"></i>
            </span>
            <span
                    class="copy-text"
                    v-text="copiedState ? 'Copied!' : 'Copy'"
            ></span>
        </button>

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
    import useElementScrollbarsSize from '@/components/useElementScrollbarsSize';

    export default defineComponent({
        name: 'CodeBlock',
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

        > .copy-text {
            width: 3em;
        }

        transition: opacity ease-in-out 0.15s;

        &:not(:hover) {
            opacity: 0.5;
        }

    }
</style>
