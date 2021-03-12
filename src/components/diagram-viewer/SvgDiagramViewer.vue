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
    import {computed, defineComponent, ref, watch} from 'vue';
    import useDragElement, {PositioningStrategy} from '@/composition/dom/useDragElement';
    import Button from '@/components/generic/form/Button.vue';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';
    import useAsyncOperation from '@/composition/async/useAsyncOperation';
    import {Point, Rectangle} from '@/util/geometric-types';
    import {parsePixelsAmount} from '@/util/css-utils';
    import useDiagramViewerZoom from '@/components/diagram-viewer/useDiagramViewerZoom';
    import useSvgDimension from '@/components/diagram-viewer/useSvgDimension';
    import useElementSize, {ResizeListenerStrategy} from '@/composition/dom/size/useElementSize';

    interface Props {
        svgCode: string | Promise<string>;
    }

    const DRAG_POSITION_X_CSS_PROPERTY = '--drag-position-x';
    const DRAG_POSITION_Y_CSS_PROPERTY = '--drag-position-y';

    export default defineComponent({
        name: 'SvgDiagramViewer',
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
            } = useAsyncOperation(() => Promise.resolve(props.svgCode), {
                keepPreviousResultWhileLoading: true
            });

            const positioningStrategy: PositioningStrategy = {
                getElementPosition(element: HTMLElement): Point {
                    return {
                        x: parsePixelsAmount(getComputedStyle(element).getPropertyValue(DRAG_POSITION_X_CSS_PROPERTY)),
                        y: parsePixelsAmount(getComputedStyle(element).getPropertyValue(DRAG_POSITION_Y_CSS_PROPERTY))
                    };
                },
                setElementPosition(element: HTMLElement, newPosition: Point): void {
                    element.style.setProperty(DRAG_POSITION_X_CSS_PROPERTY, `${newPosition.x}px`);
                    element.style.setProperty(DRAG_POSITION_Y_CSS_PROPERTY, `${newPosition.y}px`);
                }
            };

            const diagramViewportRef = ref<HTMLElement>();

            const {
                zoomScale,
                incrementZoom,
                decrementZoom,
                onWheel
            } = useDiagramViewerZoom(diagramViewportRef, positioningStrategy);

            const zoomScaleText = computed(() => `${(zoomScale.value * 100).toFixed(0)}%`);

            const {
                svgDimension,
                onSvgUpdate
            } = useSvgDimension(() => diagramViewportRef.value?.firstElementChild);

            watch(computedSvgCode, onSvgUpdate);

            // watch(computedSvgCode, () => {
            //     // FIXME we don't have to reset the position, but ensure the diagram is visible.
            //     //  We can achieve this by establishing some diagram "boundaries",
            //     //  so user can't move with total freedom, which will also prevent
            //     //  him/her to "loose" the diagram unintentionally.
            //     //  Every time the diagram changes, we can ensure the new diagram
            //     //  is inside the boundaries, or move it otherwise.
            //     resetDiagramDragPosition();
            // });
            //
            // function resetDiagramDragPosition() {
            //     const diagramViewportElement = diagramViewportRef.value;
            //
            //     if (diagramViewportElement) {
            //         diagramViewportElement.style.removeProperty(DRAG_POSITION_X_CSS_PROPERTY);
            //         diagramViewportElement.style.removeProperty(DRAG_POSITION_Y_CSS_PROPERTY);
            //     }
            // }

            // TODO sacar el tamaño escalado del SVG y su posición con respecto al viewport (como rectángulo).
            //  Sacar el rectángulo que los contiene.
            //  Escalar hasta el tamaño deseado.
            //  Ampliar la dimensión necesaria para que mantenga una cierta proporción (p.e. 16:9 o 16:10).
            //  Pintar todo esto y añadir eventos para moverlo.

            const viewportSize = useElementSize(diagramViewportRef, {
                resizeListenerStrategy: ResizeListenerStrategy.WINDOW_RESIZE_EVENT
            });

            const viewportRectangle = computed((): Rectangle => {
                return {
                    x: 0,
                    y: 0,
                    width: viewportSize.value?.clientWidth ?? 0,
                    height: viewportSize.value?.clientHeight ?? 0
                };
            });

            watch(viewportRectangle, newValue => {
                console.log('Viewport\'s rectangle:', newValue);
            });

            const {
                onPointerDown,
                onTouchStart,
                stopDrag
            } = useDragElement(positioningStrategy);

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
            --drag-position-x: 16px;
            --drag-position-y: 16px;

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
                transform: translate(var(--drag-position-x), var(--drag-position-y));
            }

        }
    }
</style>
