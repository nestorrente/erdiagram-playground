<template>
    <div
            class="is-full-height entity-relationship-model-diagram"
            v-html="svgCode"
    ></div>
</template>

<script lang="ts">
    import {computed, defineComponent} from 'vue';
    import {EntityRelationshipModel, NomnomlDiagramGenerator} from '@nestorrente/erdiagram';
    import mermaid from 'mermaid';

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

            const diagramGenerator = new NomnomlDiagramGenerator();
            // const svgCode = computed(() => diagramGenerator.generateSvgDiagram(props.model));

            mermaid.mermaidAPI.initialize({
                startOnLoad: false
            });

            const svgCode = computed(() => {

                const graphDefinition = `classDiagram
order --> product : OrderLine
`;

                return mermaid.mermaidAPI.render('graphDiv', graphDefinition);

            });

            return {
                svgCode
            };

        }
    });
</script>

<style lang="scss">
    .entity-relationship-model-diagram > svg {
        width: 100%;
    }
</style>
