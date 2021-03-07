<template>
    <div
            class="is-full-height entity-relationship-model-diagram-container"
            ref="containerRef"
            :style="{
                '--zoom-scale': zoomScale,
                '--svg-width': svgWidth + 'px',
                '--svg-height': svgHeight + 'px'
            }"
            @mousedown="onMouseDown"
            @touchstart="onTouchStart"
            @wheel="onWheel"
            v-html="svgCode"
    ></div>
</template>

<script lang="ts">
    import {defineComponent, nextTick, onMounted, ref, watch} from 'vue';
    import useDragElement from '@/components/useDragElement';

    interface Props {
        svgCode: string;
    }

    export default defineComponent({
        name: 'EntityRelationshipModelDiagram',
        props: {
            svgCode: {
                type: String,
                required: true
            }
        },
        setup(uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const containerRef = ref<HTMLElement>();
            const zoomScale = ref(1);

            const svgWidth = ref<number>(0);
            const svgHeight = ref<number>(0);

            onMounted(updateSvgSize);
            watch(() => props.svgCode, () => nextTick(updateSvgSize));

            function updateSvgSize() {

                const svg = containerRef.value?.firstElementChild;

                svgWidth.value = getNumberAttribute(svg, 'width') ?? 0;
                svgHeight.value = getNumberAttribute(svg, 'height') ?? 0;

            }

            function getNumberAttribute(element: Element | null | undefined, attributeName: string): number | undefined {
                const attributeValue = element?.getAttribute(attributeName);
                return attributeValue ? parseFloat(attributeValue) : undefined;
            }

            function onWheel(event: WheelEvent) {

                event.preventDefault();

                const delta = event.deltaX || event.deltaY || event.deltaZ;

                const zoomScaleFactor = 1 + 0.15 * -Math.sign(delta);

                zoomScale.value = applyBoundaries(zoomScale.value * zoomScaleFactor, 0.1, 3);

                // FIXME it's necessary to change the scroll position taking into account the position (x, y) of the event

            }

            function applyBoundaries(value: number, minValue: number, maxValue: number) {
                return Math.min(Math.max(value, minValue), maxValue);
            }

            const {
                onMouseDown,
                onTouchStart
            } = useDragElement();

            return {
                containerRef,
                zoomScale,
                svgWidth,
                svgHeight,
                onWheel,
                onMouseDown,
                onTouchStart
            };

        }
    });
</script>

<style lang="scss">
    .entity-relationship-model-diagram-container {
        --zoom-scale: 1;
        --svg-width: 0;
        --svg-height: 0;

        border: 1px solid #dbdbdb;
        border-radius: 4px;
        overflow: hidden;
        cursor: move;

        //display: flex;
        //align-items: center;
        //justify-content: center;

        > svg {
            //flex: 0 0 auto;
            user-select: none;
            width: calc(var(--svg-width) * var(--zoom-scale));
            height: calc(var(--svg-height) * var(--zoom-scale));
        }

    }
</style>
