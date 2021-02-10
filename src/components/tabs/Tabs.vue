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
                    :class="{'is-active': selectedTabIndex === index}"
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
                v-show="index === selectedTabIndex"
                class="is-full-height"
        >
            <VNodes :nodes="tabNode"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent, ref, SetupContext, VNode, VNodeTypes} from 'vue';
    import Tab from '@/components/tabs/Tab.vue';
    import VNodes from '@/components/VNodes.vue';

    export default defineComponent({
        name: 'Tabs',
        components: {VNodes},
        props: {
            // boxed: Boolean,
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
            }
        },
        setup(props, context: SetupContext) {

            const childNodes = computed(() => context.slots.default?.() ?? []);
            const tabNodes = computed(() => filterVNodesByType(childNodes.value, Tab));

            const tabTitles = computed(() => tabNodes.value.map(tabNode => tabNode.props!.title));

            function filterVNodesByType(vnodes: VNode[], type: VNodeTypes): VNode[] {
                return vnodes.filter(vnode => vnode.type === type);
            }

            const selectedTabIndex = ref(0);

            function selectTab(event: Event, index: number) {

                const target = event.currentTarget as HTMLElement;
                target.scrollIntoView(false);

                selectedTabIndex.value = index;

            }

            function scrollHorizontally(event: WheelEvent) {
                event.preventDefault();
                const target = event.currentTarget as HTMLElement;
                target.scrollLeft += (event.deltaY * 0.75);
            }

            return {
                tabNodes,
                tabTitles,
                selectedTabIndex,
                selectTab,
                scrollHorizontally
            };

        }
    });
</script>
