<template>
    <div
            class="tabs"
            :class="[appendTabsClass, {
                'is-boxed': boxed,
                'is-toggle': toggle
            }]"
            :style="appendTabsStyle"
    >
        <slot name="beforeTabs"></slot>
        <ul
                class="is-flex-shrink-1 has-hidden-scrollbar"
                style="overflow-y: hidden; overflow-x: auto;"
                @wheel="scrollHorizontally"
        >
            <li
                    v-for="(title, index) in tabTitles"
                    :key="index"
                    :class="{'is-active': internalSelectedTabIndex === index}"
                    @click="selectTab($event, index)"
            >
                <a>{{ title }}</a>
            </li>
        </ul>
        <slot name="afterTabs"></slot>
    </div>
    <div
            :class="appendTabsContentClass"
            :style="appendTabsContentStyle"
    >
        <div
                v-for="(tabNode, index) in tabNodes"
                :key="index"
                v-show="index === internalSelectedTabIndex"
                class="is-full-height"
        >
            <VNodes :nodes="tabNode"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent, ref, SetupContext, VNode, VNodeTypes, watch} from 'vue';
    import Tab from '@/components/tabs/Tab.vue';
    import VNodes from '@/components/VNodes.vue';

    type CssClass = string | Record<string, boolean> | CssClass[];
    type CssStyle = string | Partial<CSSStyleDeclaration> | CssStyle[];

    interface Props {
        boxed: boolean;
        toggle: boolean;
        appendTabsClass?: CssClass;
        appendTabsStyle?: CssStyle;
        appendTabsContentClass?: CssClass;
        appendTabsContentStyle?: CssStyle;
        selectedTabIndex?: number;
    }

    export default defineComponent({
        name: 'Tabs',
        emits: ['update:selectedTabIndex'],
        components: {VNodes},
        props: {
            boxed: Boolean,
            toggle: Boolean,
            appendTabsClass: {
                type: [String, Array, Object],
                required: false
            },
            appendTabsStyle: {
                type: [String, Array, Object],
                required: false
            },
            appendTabsContentClass: {
                type: [String, Array, Object],
                required: false
            },
            appendTabsContentStyle: {
                type: [String, Array, Object],
                required: false
            },
            selectedTabIndex: {
                type: Number,
                required: false
            }
        },
        setup(uncastedProps, context: SetupContext) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const childNodes = computed(() => context.slots.default?.() ?? []);
            const tabNodes = computed(() => filterVNodesByType(childNodes.value, Tab));

            const tabTitles = computed(() => tabNodes.value.map(tabNode => tabNode.props!.title));

            function filterVNodesByType(vnodes: VNode[], type: VNodeTypes): VNode[] {
                return vnodes.filter(vnode => vnode.type === type);
            }

            const internalSelectedTabIndex = ref(0);
            watch(() => props.selectedTabIndex, newValue => {
                if (newValue != null) {
                    internalSelectedTabIndex.value = newValue;
                }
            }, {immediate: true});

            function selectTab(event: Event, index: number) {

                const target = event.currentTarget as HTMLElement;
                target.scrollIntoView(false);

                internalSelectedTabIndex.value = index;
                context.emit('update:selectedTabIndex', index);

            }

            function scrollHorizontally(event: WheelEvent) {
                if (event.deltaY !== 0) {
                    event.preventDefault();
                    const target = event.currentTarget as HTMLElement;
                    target.scrollLeft += (event.deltaY * 0.75);
                }
            }

            return {
                tabNodes,
                tabTitles,
                internalSelectedTabIndex,
                selectTab,
                scrollHorizontally
            };

        }
    });
</script>
