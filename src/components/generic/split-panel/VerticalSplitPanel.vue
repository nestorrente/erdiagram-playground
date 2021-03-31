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
    import useVerticalSplitPanelLeftColumnWidthPercentAndPositionManager
        from '@/components/generic/split-panel/useVerticalSplitPanelLeftColumnWidthPercentAndPositionManager';

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

            const leftColumnRef = ref<HTMLElement>();

            const {
                leftColumnWidthPercent,
                leftColumnWidthPositionManager
            } = useVerticalSplitPanelLeftColumnWidthPercentAndPositionManager(leftColumnRef);

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
