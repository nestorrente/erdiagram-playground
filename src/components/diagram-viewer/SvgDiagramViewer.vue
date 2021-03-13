<template>
    <div
            class="is-full-height svg-diagram-viewer"
    >
        <transition name="fade">
            <div
                    v-show="loading"
                    class="loading-spinner-container"
            >
                <p class="mb-3">Generating chart...</p>
                <progress class="progress is-extra-small is-info mb-3"></progress>
            </div>
        </transition>

        <div class="diagram-toolbar" v-show="computedSvgCode">
            <span class="zoom-scale-indicator">{{ zoomScaleText }}</span>

            <Button
                    icon="fas fa-plus"
                    outlined
                    small
                    @click="incrementZoom()"
            ></Button>

            <Button
                    icon="fas fa-minus"
                    outlined
                    small
                    @click="decrementZoom()"
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
                ref="diagramViewportRef"
                class="svg-diagram-viewport"
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
    import {computed, defineComponent, nextTick, ref, watch} from 'vue';
    import useDragElement from '@/composition/dom/useDragElement';
    import StandardPositioningStrategies from '@/util/StandardPositioningStrategies';
    import Button from '@/components/generic/form/Button.vue';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';
    import useAsyncOperation from '@/composition/async/useAsyncOperation';
    import {Dimension, Rectangle, scaleDimension} from '@/util/geometric-types';
    import useDiagramViewerZoom from '@/components/diagram-viewer/useDiagramViewerZoom';
    import useSvgDimension from '@/components/diagram-viewer/useSvgDimension';
    import useElementSize from '@/composition/dom/size/useElementSize';
    import {StandardResizeListenerStrategies} from '@/composition/dom/size/ResizeListenerStrategy';
    import {addBoundariesToPositionStrategy} from '@/util/PositioningStrategy';

    interface Props {
        svgCode: string | Promise<string>;
    }

    export default defineComponent({
        name: 'SvgDiagramViewer',
        components: {FileDownloadWrapper, Button},
        props: {
            svgCode: {
                type: [String, Promise],
                required: true
            }
        },
        setup: function (uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as unknown as Props;

            const {
                data: computedSvgCode,
                loading
            } = useAsyncOperation(() => Promise.resolve(props.svgCode), {
                keepPreviousResultWhileLoading: true
            });

            const diagramViewportRef = ref<HTMLElement>();

            const {
                svgDimension,
                onSvgUpdate
            } = useSvgDimension(() => diagramViewportRef.value?.firstElementChild);

            watch(computedSvgCode, onSvgUpdate);

            // START

            const scaledSvgDimension = computed(() => {
                // FIXME revisar el ciclo de dependencias.
                //  Esto depende de ZoomScale, zoomScale viene de useDiagramViewerZoom, que depende del position strategy (el cual depende de esto a su vez).
                if (!zoomScale?.value) {
                    return svgDimension.value;
                }
                return scaleDimension(svgDimension.value, zoomScale.value);
            });

            const viewportSize = useElementSize(diagramViewportRef, {
                resizeListenerStrategy: StandardResizeListenerStrategies.WINDOW_RESIZE_EVENT
            });

            const viewportDimension = computed((): Dimension => {
                return {
                    width: viewportSize.value?.clientWidth ?? 0,
                    height: viewportSize.value?.clientHeight ?? 0
                };
            });

            const dragBoundaries = computed((): Rectangle => {

                const {
                    width: imageWidth,
                    height: imageHeight
                } = scaledSvgDimension.value;

                const {
                    width: viewportWidth,
                    height: viewportHeight
                } = viewportDimension.value;

                return {
                    x: -imageWidth,
                    y: -imageHeight,
                    width: viewportWidth,
                    height: viewportHeight
                };

            });

            const boundariesAwarePositioningStrategy = addBoundariesToPositionStrategy(
                    StandardPositioningStrategies.CSS_VARIABLE,
                    () => dragBoundaries.value
            );

            watch(dragBoundaries, () => nextTick(() => {

                const diagramViewportElement = diagramViewportRef.value;

                if (diagramViewportElement) {
                    const currentPosition = boundariesAwarePositioningStrategy.getElementPosition(diagramViewportElement);
                    boundariesAwarePositioningStrategy.setElementPosition(diagramViewportElement, currentPosition);
                }

            }));

            // END

            const {
                zoomScale,
                incrementZoom,
                decrementZoom,
                onWheel
            } = useDiagramViewerZoom(diagramViewportRef, boundariesAwarePositioningStrategy);

            const zoomScaleText = computed(() => `${(zoomScale.value * 100).toFixed(0)}%`);

            const {
                onPointerDown,
                onTouchStart,
                stopDrag
            } = useDragElement(boundariesAwarePositioningStrategy);

            watch(loading, newValue => newValue && stopDrag());

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
    .svg-diagram-viewer {
        position: relative;
        border: 1px solid #dbdbdb;
        background: white;
        border-radius: 4px;
        overflow: hidden;
        cursor: move;

        > .loading-spinner-container {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            padding: 1em;
            z-index: 1;

            background: rgba(255, 255, 255, 0.85);

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        > .diagram-toolbar {
            position: absolute;
            top: 1em;
            right: 1em;
            opacity: 0.7;
            transition: opacity ease-in-out 0.15s;
            z-index: 1;

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

        > .svg-diagram-viewport {
            width: 100%;
            height: 100%;
            overflow: hidden;
            //padding: 1em;

            --zoom-scale: 1;
            --svg-width: 0px;
            --svg-height: 0px;

            // This is the same as 1em for the current font-size,
            // but we need to use pixel units in these variables.
            --position-x: 16px;
            --position-y: 16px;

            display: flex;
            //align-items: center;
            //justify-content: center;

            > svg {
                flex: 0 0 auto;
                pointer-events: none;
                user-select: none;
                // We use important in order to override inline style of the <svg> tag (if present)
                width: calc(var(--svg-width) * var(--zoom-scale)) !important;
                height: calc(var(--svg-height) * var(--zoom-scale)) !important;
                transform: translate(var(--position-x), var(--position-y));
            }

        }
    }
</style>
