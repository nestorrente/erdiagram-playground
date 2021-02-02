<template>
	<pre
            :class="{'code-container': true, 'is-full-height': fullHeight}"
    ><code
            ref="codeBlock"
            :class="[lang, {'is-full-height': fullHeight}]"
            v-text="code"
    ></code></pre>
</template>

<script lang="ts">
    import {defineComponent, onMounted, onUpdated, ref} from 'vue';
    import hljs from 'highlight.js';

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
        setup() {

            const codeBlock = ref<HTMLElement>();

            onMounted(applyHighlights);
            onUpdated(applyHighlights);

            function applyHighlights() {
                hljs.highlightBlock(codeBlock.value!);
            }

            return {
                codeBlock
            };

        }
    });
</script>

<style lang="scss">
    .code-container {
        //border: 1px solid lightgrey;
        border-radius: 4px;
        overflow: hidden;
        padding: 0;
    }

    .code-container > code {
        padding: 1.25em;
    }
</style>
