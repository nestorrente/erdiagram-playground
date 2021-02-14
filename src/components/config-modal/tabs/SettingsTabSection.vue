<template>
    <section class="section settings-tab-section">
        <h2 class="is-size-4 mb-5 has-text-weight-bold">{{ title }}</h2>

        <slot></slot>
    </section>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'SettingsTabSection',
        props: {
            title: {
                type: String,
                required: true
            }
        }
    });
</script>

<style lang="scss">
    .settings-tab-section {
        padding-top: 1.5em;
        padding-bottom: 1.5em;
    }
</style>
