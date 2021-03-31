<template>
    <div
            class="split-panel columns is-desktop is-full-height"
            :style="{
                '--left-column-width-percent': `${leftColumnWidthPercent}%`
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
        ></div>

        <div
                class="split-panel-right-column column"
        >
            <slot name="right"/>
        </div>

    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import useDragElement from '@/composition/dom/useDragElement';
    import {Point} from '@/util/geometric-types';
    import PositionManager from '@/util/positioning-strategy/PositionManager';
    import {applyBoundariesToNumber} from '@/util/math-utils';
    import {useWindowEventListener} from '@/composition/event/useEventListener';

    export default defineComponent({
        name: 'VerticalSplitPanel',
        components: {},
        props: {
            showingSettingsModal: {
                type: Boolean,
                requried: true
            }
        },
        setup() {

            // We use 16px, as it's the equivalent to 1em for the current font size.
            const oneEmInPixels = 16;

            const leftColumnRef = ref<HTMLElement>();
            const leftColumnWidthPercent = ref(50);

            const columnGap = oneEmInPixels * 0.75;
            const horizontalPageMargin = oneEmInPixels * 0.75;

            const leftColumnMinWidth = 410;
            const rightColumnMinWidth = 410;
            const leftColumnMaxWidth = ref(getLeftColumnMaxWidth());

            function getLeftColumnMaxWidth() {
                const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                return pageWidth - 2 * horizontalPageMargin - 2 * columnGap - rightColumnMinWidth;
            }

            useWindowEventListener('resize', () => {

                leftColumnMaxWidth.value = getLeftColumnMaxWidth();

                // Force column's width recomputing
                const previousPosition = leftColumnWidthPositionManager.getPosition();
                leftColumnWidthPositionManager.setPosition(previousPosition);

            });

            const leftColumnWidthPositionManager: PositionManager = {
                getPosition(): Point {
                    return {
                        x: leftColumnRef.value?.offsetWidth ?? 0,
                        y: 0
                    };
                },
                setPosition(newPosition: Point) {

                    const leftColumn = leftColumnRef.value;

                    if (leftColumn) {
                        leftColumnWidthPercent.value = getNewLeftColumnWidthPercent(leftColumn, newPosition.x);
                    }

                }
            };

            // TODO add boundaries for min and max width
            // TODO once the boundaries are added, recompute the position on window resize
            function getNewLeftColumnWidthPercent(leftColumn: HTMLElement, newLeftColumnWidth: number) {

                const boundNewLeftColumnWidth = applyBoundariesToNumber(newLeftColumnWidth, leftColumnMinWidth, leftColumnMaxWidth.value);

                const previousLeftColumnWidth = leftColumn.offsetWidth;
                const previousLeftColumnWidthPercent = leftColumnWidthPercent.value;

                return previousLeftColumnWidthPercent * (boundNewLeftColumnWidth + columnGap) / (previousLeftColumnWidth + columnGap);

            }

            const {
                onPointerDown,
                onTouchStart
            } = useDragElement(leftColumnWidthPositionManager);

            return {
                leftColumnWidthPercent,
                leftColumnRef,
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

            .split-panel-left-column {
                flex: none;
                width: calc(var(--left-column-width-percent) - #{$column-gap});
                padding-right: 0;
            }

            .split-panel-resize-area {
                width: calc(2 * #{$column-gap});
                cursor: col-resize;
            }

            .split-panel-right-column {
                flex: none;
                width: calc(100% - var(--left-column-width-percent) - #{$column-gap});
                padding-left: 0;
            }

        }
    }
</style>
