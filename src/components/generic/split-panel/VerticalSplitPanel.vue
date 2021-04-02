<template>
    <div
            class="split-panel columns is-desktop is-full-height"
            :style="{
                '--left-column-width': `${leftColumnWidthPercentRef}%`
            }"
    >

        <div
                class="split-panel-left-column column"
                ref="leftColumnRef"
        >
            <slot name="left"/>
        </div>

        <div
                class="split-panel-resize-area column is-narrow-desktop is-hidden-touch"
                @pointerdown="onPointerDown"
                @touchstart="onTouchStart"
        >
            <div class="split-panel-resize-area-indicator"></div>
        </div>

        <div
                class="split-panel-right-column column"
        >
            <slot name="right"/>
        </div>

    </div>
</template>

<script lang="ts">
    import {defineComponent, ref, SetupContext} from 'vue';
    import useDragElement from '@/composition/dom/useDragElement';
    import useVerticalSplitPanelLeftColumnWidthPositionManager
        from '@/components/generic/split-panel/useVerticalSplitPanelLeftColumnWidthPositionManager';
    import useControllablePropRef from '@/composition/util/useControllablePropRef';

    interface Props {
        leftColumnMinWidth?: string;
        rightColumnMinWidth?: string;
        leftColumnWidthPercent: number;
    }

    export default defineComponent({
        name: 'VerticalSplitPanel',
        components: {},
        props: {
            leftColumnMinWidth: {
                type: String,
                default: 'unset'
            },
            rightColumnMinWidth: {
                type: String,
                default: 'unset'
            },
            leftColumnWidthPercent: {
                type: Number,
                default: 50
            }
        },
        setup(uncastedProps: any, context: SetupContext) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const leftColumnRef = ref<HTMLElement>();

            const leftColumnWidthPercentRef = useControllablePropRef(props, 'leftColumnWidthPercent', context);
            const leftColumnWidthPositionManager = useVerticalSplitPanelLeftColumnWidthPositionManager(leftColumnRef, leftColumnWidthPercentRef);

            const {
                onPointerDown,
                onTouchStart
            } = useDragElement(leftColumnWidthPositionManager);

            return {
                leftColumnRef,
                leftColumnWidthPercentRef,
                onPointerDown,
                onTouchStart
            };

        }
    });
</script>

<style lang="scss">
    @media screen and (min-width: 1024px) {
        .split-panel {

            $column-gap: 0.75em;
            --left-column-width: calc(50% - #{$column-gap});

            .split-panel-left-column,
            .split-panel-right-column {
                overflow: auto;
            }

            .split-panel-left-column {

                padding-right: 0;
                flex: none;

                width: var(--left-column-width);
                min-width: v-bind(leftColumnMinWidth);
                max-width: calc(100% - 2 * #{$column-gap} - v-bind(leftColumnMinWidth));

            }

            .split-panel-resize-area {

                padding: 0;
                width: calc(2 * #{$column-gap});

                display: flex;
                align-items: center;
                justify-content: center;

                cursor: col-resize;
                user-select: none;

                .split-panel-resize-area-indicator {
                    background: #bbb;
                    width: 0.3em;
                    height: 5em;
                    border-radius: 0.5em;
                    transition: opacity 0.3s ease;
                    opacity: 0.5;
                }

                &:hover {
                    .split-panel-resize-area-indicator {
                        opacity: 1;
                    }
                }

            }

            .split-panel-right-column {
                padding-left: 0;
                flex: 1 1 auto;
            }

        }
    }
</style>
