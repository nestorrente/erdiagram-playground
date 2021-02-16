<template>
    <slot></slot>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'Tab',
        props: {
            name: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        }
    });
</script>
