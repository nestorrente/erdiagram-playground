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
                ref="diagramViewportRef"
                class="diagram-viewport"
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
    import useDragElement, {PositioningStrategy} from '@/composition/dom/useDragElement';
    import Button from '@/components/generic/form/Button.vue';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';
    import useAsyncOperation from '@/composition/async/useAsyncOperation';
    import {addPoints, Dimension, Point, scalePoint, substractPoints, unscalePoint} from '@/util/geometric-types';
    import {parsePixelsAmount} from '@/util/css-utils';

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

            const diagramViewportRef = ref<HTMLElement>();

            const svgDimension = ref<Dimension>({
                width: 0,
                height: 0
            });

            onMounted(updateSvgSize);
            watch(computedSvgCode, () => {
                resetDiagramDragPosition();
                nextTick(updateSvgSize);
            });

            function updateSvgSize() {

                const svgElement = diagramViewportRef.value?.firstElementChild;

                svgDimension.value = {
                    width: getNumberAttribute(svgElement, 'width') ?? 0,
                    height: getNumberAttribute(svgElement, 'height') ?? 0
                };

            }

            function getNumberAttribute(element: Element | null | undefined, attributeName: string): number | undefined {
                const attributeValue = element?.getAttribute(attributeName);
                return attributeValue ? parseFloat(attributeValue) : undefined;
            }

            function onWheel(event: WheelEvent) {

                event.preventDefault();

                const delta = event.deltaX || event.deltaY || event.deltaZ;

                const viewportReferencePoint: Point = {
                    x: event.offsetX,
                    y: event.offsetY
                };
                console.log('Ref point:', viewportReferencePoint);

                if (delta < 0) {
                    // incrementZoom({x: 300, y: 90});
                    incrementZoom(viewportReferencePoint);
                } else if (delta > 0) {
                    // decrementZoom({x: 300, y: 90});
                    decrementZoom(viewportReferencePoint);
                }

            }

            function incrementZoom(viewportReferencePoint?: Point) {
                changeZoom(zoomScaleIndex.value + 1, viewportReferencePoint);
            }

            function decrementZoom(viewportReferencePoint?: Point) {
                changeZoom(zoomScaleIndex.value - 1, viewportReferencePoint);
            }

            function changeZoom(newZoomScaleIndex: number, viewportReferencePoint: Point = getSvgCenterPoint()) {

                const previousZoomScale = zoomScale.value;
                zoomScaleIndex.value = Math.min(Math.max(newZoomScaleIndex, 0), ZOOM_SCALES.length - 1);

                if (previousZoomScale != zoomScale.value) {
                    // adjustScrollAfterScaleChanged(viewportReferencePoint, previousZoomScale);
                    nextTick(() => adjustScrollAfterScaleChanged(viewportReferencePoint, previousZoomScale));
                }

            }

            function adjustScrollAfterScaleChanged(viewportReferencePoint: Point, previousZoomScale: number) {

                const diagramViewportElement = diagramViewportRef.value;

                if (!diagramViewportElement) {
                    return;
                }

                const currentTranslationPosition = positioningStrategy.getElementPosition(diagramViewportElement);
                const diagramReferencePoint = substractPoints(viewportReferencePoint, currentTranslationPosition);

                // const previousScaledDimension = getSvgScaledDimension(previousZoomScale);
                // const newScaledDimension = getSvgScaledDimension(zoomScale.value);
                //
                // const referencePointWidthPercent = diagramReferencePoint.x / previousScaledDimension.width;
                // const referencePointHeightPercent = diagramReferencePoint.y / previousScaledDimension.height;
                //
                // const newDiagramReferencePoint: Point = {
                //     x: referencePointWidthPercent * newScaledDimension.width,
                //     y: referencePointHeightPercent * newScaledDimension.height
                // };
                const newDiagramReferencePoint = scalePoint(unscalePoint(diagramReferencePoint, previousZoomScale), zoomScale.value);

                const newViewportReferencePoint = addPoints(newDiagramReferencePoint, currentTranslationPosition);

                const viewportReferencePointsDiff = substractPoints(newViewportReferencePoint, viewportReferencePoint);
                console.log('VRPDiff', viewportReferencePointsDiff);

                const newTranslationPosition = substractPoints(currentTranslationPosition, viewportReferencePointsDiff);
                positioningStrategy.setElementPosition(diagramViewportElement, newTranslationPosition);

            }

            function getSvgScaledDimension(scale: number): Dimension {
                return {
                    width: svgDimension.value.width * scale,
                    height: svgDimension.value.height * scale
                };
            }

            // FIXME use viewport's center point, not SVG's
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

            function resetDiagramDragPosition() {
                const diagramViewportElement = diagramViewportRef.value;

                if (diagramViewportElement) {
                    positioningStrategy.setElementPosition(diagramViewportElement, {x: 0, y: 0});
                }
            }

            const positioningStrategy: PositioningStrategy = {
                getElementPosition(element: HTMLElement): Point {
                    return {
                        x: parsePixelsAmount(element.style.getPropertyValue(`--drag-position-x`)),
                        y: parsePixelsAmount(element.style.getPropertyValue('--drag-position-y'))
                    };
                },
                setElementPosition(element: HTMLElement, newPosition: Point): void {
                    element.style.setProperty('--drag-position-x', `${newPosition.x}px`);
                    element.style.setProperty('--drag-position-y', `${newPosition.y}px`);
                }
            };
            const {
                onPointerDown,
                onTouchStart
            } = useDragElement(positioningStrategy);

            return {
                computedSvgCode,
                loading,
                zoomScale,
                zoomScaleText,
                incrementZoom,
                decrementZoom,
                diagramViewportRef,
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
            z-index: 1000;

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

        > .diagram-viewport {
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding: 1em;

            --zoom-scale: 1;
            --svg-width: 0px;
            --svg-height: 0px;

            --drag-position-x: 0px;
            --drag-position-y: 0px;

            display: flex;
            //align-items: center;
            //justify-content: center;

            > svg {
                flex: 0 0 auto;
                user-select: none;
                // We use important in order to override inline style of the <svg> tag (if present)
                width: calc(var(--svg-width) * var(--zoom-scale)) !important;
                height: calc(var(--svg-height) * var(--zoom-scale)) !important;
                transform: translate(var(--drag-position-x), var(--drag-position-y));
                transform-origin: 0 0;
            }

        }
    }
</style>
