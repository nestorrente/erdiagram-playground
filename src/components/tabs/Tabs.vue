<template>
    <div
            class="tabs"
            :class="appendTabsClass"
            :style="appendTabsStyle"
    >
        <slot name="beforeTabs"></slot>
        <ul>
            <li
                    v-for="(title, index) in tabTitles"
                    :key="index"
                    :class="{'is-active': selectedTabIndex === index}"
                    @click="selectedTabIndex = index"
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

            return {
                tabNodes,
                tabTitles,
                selectedTabIndex
            };

        }
    });
</script>
