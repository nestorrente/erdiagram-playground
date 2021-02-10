<template>
    <slot></slot>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'Tab',
        props: {
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
