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
    import {computed, defineComponent, ref} from 'vue';
    import {EntityRelationshipModel, NomnomlDiagramGenerator} from '@nestorrente/erdiagram';

    interface Props {
        model: EntityRelationshipModel;
    }

    export default defineComponent({
        name: 'EntityRelationshipModelDiagram',
        props: {
            model: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const zoom = ref(false);

            const diagramGenerator = new NomnomlDiagramGenerator();
            const svgCode = computed(() => diagramGenerator.generateSvgDiagram(props.model, {
                leading: 1.7
            }));

            return {
                zoom,
                svgCode
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
        }

        &:not(.zoom) > svg {
            max-width: 100%;
            max-height: 100%;
        }
    }
</style>
