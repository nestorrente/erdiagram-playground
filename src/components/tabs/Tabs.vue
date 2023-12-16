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
                    v-for="tabData in tabsData"
                    :key="tabData.name"
                    :class="{'is-active': tabData.name === internalSelectedTabName}"
                    @click="selectTab($event, tabData.name)"
            >
                <a>{{ tabData.title }}</a>
            </li>
        </ul>
        <slot name="afterTabs"></slot>
    </div>
    <div
            ref="tabsContentsContainer"
            :class="appendTabsContentClass"
            :style="appendTabsContentStyle"
    >
        <div
                v-for="tabData in tabsData"
                :key="tabData.name"
                v-show="tabData.name === internalSelectedTabName"
                class="is-full-height"
        >
            <VNodes :nodes="tabData.node"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent, PropType, ref, SetupContext, StyleValue, VNode, VNodeTypes, watch} from 'vue';
    import Tab from '@/components/tabs/Tab.vue';
    import VNodes from '@/components/VNodes.vue';

    type CssClass = string | Record<string, boolean> | CssClass[];
    type CssStyle = string | Partial<CSSStyleDeclaration> | CssStyle[];

    interface Props {
        boxed: boolean;
        toggle: boolean;
        resetScrollOnTabChange: boolean;
        appendTabsClass?: CssClass;
        appendTabsStyle?: CssStyle;
        appendTabsContentClass?: CssClass;
        appendTabsContentStyle?: CssStyle;
        selectedTabName?: string;
    }

    interface TabData {
        name: string;
        title: string;
        node: VNode;
    }

    export default defineComponent({
        name: 'Tabs',
        emits: ['update:selectedTabName'],
        components: {VNodes},
        props: {
            boxed: Boolean,
            toggle: Boolean,
            resetScrollOnTabChange: Boolean,
            appendTabsClass: {
                type: [String, Array, Object],
                required: false
            },
            appendTabsStyle: {
                type: [String, Array, Object] as PropType<StyleValue>,
                required: false
            },
            appendTabsContentClass: {
                type: [String, Array, Object],
                required: false
            },
            appendTabsContentStyle: {
                type: [String, Array, Object] as PropType<StyleValue>,
                required: false
            },
            selectedTabName: {
                type: String,
                required: false
            }
        },
        setup(uncastedProps, context: SetupContext) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const childNodes = computed(() => context.slots.default?.() ?? []);
            const tabNodes = computed(() => filterVNodesByType(childNodes.value, Tab));
            const tabsData = computed(() => tabNodes.value.map(getTabData));

            function getTabData(tabNode: VNode): TabData {
                return {
                    name: tabNode.props!.name as string,
                    title: tabNode.props!.title as string,
                    node: tabNode
                };
            }

            function filterVNodesByType(vnodes: VNode[], type: VNodeTypes): VNode[] {
                return vnodes.filter(vnode => vnode.type === type);
            }

            const internalSelectedTabName = ref(tabsData.value[0]?.name);

            watch(() => props.selectedTabName, newValue => {
                if (newValue != null) {
                    internalSelectedTabName.value = newValue;
                }
            }, {immediate: true});

            const tabsContentsContainer = ref<HTMLElement>();

            watch(internalSelectedTabName, () => {
                if (props.resetScrollOnTabChange) {
                    tabsContentsContainer.value?.scrollTo(0, 0);
                }
            });

            function selectTab(event: Event, tabName: string) {

                const target = event.currentTarget as HTMLElement;
                target.scrollIntoView(false);

                internalSelectedTabName.value = tabName;
                context.emit('update:selectedTabName', tabName);

            }

            function scrollHorizontally(event: WheelEvent) {
                if (event.deltaY !== 0) {
                    event.preventDefault();
                    const target = event.currentTarget as HTMLElement;
                    target.scrollLeft += (event.deltaY * 0.75);
                }
            }

            return {
                tabsData,
                internalSelectedTabName,
                tabsContentsContainer,
                selectTab,
                scrollHorizontally
            };

        }
    });
</script>
