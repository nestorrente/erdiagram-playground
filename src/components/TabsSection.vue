<template>
    <div class="vertical-full-container">
        <div class="tabs vfc-item">
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
        <div class="vfc-item vfc-grow">
            <div
                    v-for="(header, index) in headers"
                    :key="index"
                    v-show="index === selectedTabIndex"
                    class="is-full-height"
            >
                <slot :name="`tab${index}`"></slot>
            </div>
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
