<template>
    <div
            class="is-full-height entity-relationship-model-diagram-container"
    >
        <div
                v-show="loading"
                class="loading-spinner-container"
        >
            <p class="mb-3">Generating chart...</p>
            <progress class="progress is-extra-small is-info mb-3"></progress>
        </div>

        <div class="diagram-toolbar" v-show="computedSvgCode">
            <span class="zoom-scale-indicator">{{ zoomScaleText }}</span>

            <Button
                    icon="fas fa-plus"
                    outlined
                    small
                    @click="incrementZoom"
            ></Button>

            <Button
                    icon="fas fa-minus"
                    outlined
                    small
                    @click="decrementZoom"
            ></Button>

            <FileDownloadWrapper
                    file-name="diagram.svg"
                    :file-contents="computedSvgCode"
                    #default="{downloadFile}"
            >
                <Button
                        color="dark"
                        small
                        icon="fas fa-download"
                        class="copy-button"
                        title="Download"
                        @click="downloadFile"
                ></Button>
            </FileDownloadWrapper>
        </div>

        <div
                v-show="computedSvgCode"
                ref="diagramRef"
                class="entity-relationship-model-diagram"
                :style="{
                    '--zoom-scale': zoomScale,
                    '--svg-width': svgDimension.width + 'px',
                    '--svg-height': svgDimension.height + 'px'
                }"
                @pointerdown="onPointerDown"
                @touchstart="onTouchStart"
                @wheel="onWheel"
                v-html="computedSvgCode"
        ></div>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent, nextTick, onMounted, ref, watch} from 'vue';
    import useDragElement from '@/composition/dom/useDragElement';
    import Button from '@/components/generic/form/Button.vue';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';
    import useAsyncOperation from '@/composition/async/useAsyncOperation';
    import {Dimension, Point} from '@/util/geometric-types';

    interface Props {
        svgCode: string | Promise<string>;
    }

    const ZOOM_SCALES = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3];

    export default defineComponent({
        name: 'EntityRelationshipModelDiagram',
        components: {FileDownloadWrapper, Button},
        props: {
            svgCode: {
                type: [String, Promise],
                required: true
            }
        },
        setup(uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as unknown as Props;

            const {
                data: computedSvgCode,
                loading
            } = useAsyncOperation(() => Promise.resolve(props.svgCode));

            const zoomScaleIndex = ref(ZOOM_SCALES.indexOf(1));
            const zoomScale = computed(() => ZOOM_SCALES[zoomScaleIndex.value]);
            const zoomScaleText = computed(() => `${(zoomScale.value * 100).toFixed(0)}%`);

            const diagramRef = ref<HTMLElement>();

            const svgDimension = ref<Dimension>({
                width: 0,
                height: 0
            });

            onMounted(updateSvgSize);
            watch(computedSvgCode, () => nextTick(updateSvgSize));

            function updateSvgSize() {

                const svg = diagramRef.value?.firstElementChild;

                svgDimension.value = {
                    width: getNumberAttribute(svg, 'width') ?? 0,
                    height: getNumberAttribute(svg, 'height') ?? 0
                };

            }

            function getNumberAttribute(element: Element | null | undefined, attributeName: string): number | undefined {
                const attributeValue = element?.getAttribute(attributeName);
                return attributeValue ? parseFloat(attributeValue) : undefined;
            }

            function onWheel(event: WheelEvent) {

                event.preventDefault();

                const delta = event.deltaX || event.deltaY || event.deltaZ;

                // FIXME it's necessary to change the scroll position taking into account the position (x, y) of the event
                if (delta < 0) {
                    incrementZoom();
                } else if (delta > 0) {
                    decrementZoom();
                }

            }

            function incrementZoom(referencePoint?: Point) {
                changeScale(zoomScaleIndex.value + 1, referencePoint);
            }

            function decrementZoom(referencePoint?: Point) {
                changeScale(zoomScaleIndex.value - 1, referencePoint);
            }

            function changeScale(newScaleIndex: number, referencePoint: Point = getSvgCenterPoint()) {

                const previousScale = zoomScale.value;
                zoomScaleIndex.value = Math.min(Math.max(newScaleIndex, 0), ZOOM_SCALES.length - 1);

                // nextTick(() => adjustScrollAfterScaleChanged(referencePoint, previousScale));

            }

            function adjustScrollAfterScaleChanged(referencePoint: Point, previousScale: number) {

                const diagramElement = diagramRef.value;

                if (!diagramElement) {
                    return;
                }

                const previousScaledDimension = getSvgScaledDimension(previousScale);
                const newScaledDimension = getSvgScaledDimension(zoomScale.value);

                const referencePointWidthPercent = referencePoint.x / previousScaledDimension.width;
                const referencePointHeightPercent = referencePoint.y / previousScaledDimension.height;

                const newReferencePoint: Point = {
                    x: referencePointWidthPercent * newScaledDimension.width,
                    y: referencePointHeightPercent * newScaledDimension.height
                };

                const deltaScroll = subtractPoints(newReferencePoint, referencePoint);
                console.log('Delta scroll:', deltaScroll);

                diagramElement.scrollBy(deltaScroll.x, deltaScroll.y);

            }

            function getSvgCenterPoint(): Point {

                const {
                    width,
                    height
                } = svgDimension.value;

                return {
                    x: width / 2,
                    y: height / 2
                };

            }

            function getSvgScaledDimension(scale: number): Dimension {
                return {
                    width: svgDimension.value.width * scale,
                    height: svgDimension.value.height * scale
                };
            }

            function subtractPoints(pointA: Point, pointB: Point): Point {
                return {
                    x: pointA.x - pointB.x,
                    y: pointA.y - pointB.y
                };
            }

            const {
                onPointerDown,
                onTouchStart
            } = useDragElement();

            return {
                computedSvgCode,
                loading,
                zoomScale,
                zoomScaleText,
                incrementZoom,
                decrementZoom,
                diagramRef,
                svgDimension,
                onWheel,
                onPointerDown,
                onTouchStart
            };

        }
    });
</script>

<style lang="scss">
    .entity-relationship-model-diagram-container {
        position: relative;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        overflow: hidden;
        cursor: move;

        > .loading-spinner-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            width: 100%;
            height: 100%;
            padding: 1rem;
        }

        > .diagram-toolbar {
            position: absolute;
            top: 1em;
            right: 1em;
            opacity: 0.7;
            transition: opacity ease-in-out 0.15s;

            &:hover {
                opacity: 1;
            }

            > .zoom-scale-indicator {
                vertical-align: middle;
            }

            > * + * {
                margin-left: 0.5em;
            }
        }

        > .entity-relationship-model-diagram {
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding: 1em;

            --zoom-scale: 1;
            --svg-width: 0;
            --svg-height: 0;

            > svg {
                user-select: none;
                // We use important in order to override inline style of the <svg> tag (if present)
                width: calc(var(--svg-width) * var(--zoom-scale)) !important;
                height: calc(var(--svg-height) * var(--zoom-scale)) !important;
            }

        }
    }
</style>
