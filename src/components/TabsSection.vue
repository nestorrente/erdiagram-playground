<template>
    <div
            class="tabs"
            :class="appendTabsClass"
            :style="appendTabsStyle"
    >
        <ul>
            <li
                    v-for="(header, index) in headers"
                    :key="index"
                    :class="{'is-active': index === selectedTabIndex}"
                    @click="selectedTabIndex = index"
            >
                <a>{{ header }}</a>
            </li>
        </ul>
    </div>
    <div
            :class="appendTabsContentClass"
            :style="appendTabsContentStyle"
    >
        <div
                v-for="(header, index) in headers"
                :key="index"
                v-show="index === selectedTabIndex"
                class="is-full-height"
        >
            <slot :name="`tab${index}`"></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';

    export default defineComponent({
        name: 'TabsSection',
        props: {
            headers: {
                type: Array,
                required: true
            },
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
        setup() {

            const selectedTabIndex = ref(0);

            return {
                selectedTabIndex
            };

        }
    });
</script>
