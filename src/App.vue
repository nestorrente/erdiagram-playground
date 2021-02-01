<template>
    <NavBar/>
    <div class="container">
        <div class="columns">
            <div class="column">A</div>
            <div class="column">
                <div ref="codeBlock" v-text="'var x = 5;'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, onMounted, ref} from 'vue';
    import NavBar from '@/components/NavBar.vue';
    import hljs from 'highlight.js';

    export default defineComponent({
        name: 'App',
        components: {
            NavBar
        },
        setup() {

            const codeBlock = ref<HTMLElement>();

            onMounted(() => {
                console.log('Mounted');
                hljs.highlightBlock(codeBlock.value!);
            })

            return {
                codeBlock
            };

        }
    });
</script>
