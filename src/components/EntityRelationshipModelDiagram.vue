<template>
    <div
            class="is-full-height entity-relationship-model-diagram"
            :class="{
                zoom: zoom
            }"
            @click="zoom = !zoom"
            v-html="svgCode"
    ></div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';

    export default defineComponent({
        name: 'EntityRelationshipModelDiagram',
        props: {
            svgCode: {
                type: String,
                required: true
            }
        },
        setup() {

            const zoom = ref(false);

            return {
                zoom
            };

        }
    });
</script>

<style lang="scss">
    .entity-relationship-model-diagram {
        cursor: zoom-in;

        &.zoom {
            overflow: auto;
            cursor: zoom-out;
        }

        > svg {
            user-select: none;
            width: auto;
            height: auto;
        }

        &:not(.zoom) > svg {
            max-width: 100%;
            max-height: 100%;
        }
    }
</style>
