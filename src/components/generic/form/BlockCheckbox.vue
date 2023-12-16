<template>
    <label class="checkbox" :class="{'disabled-label': disabled}">
        <input
                type="checkbox"
                class="mr-1"
                :checked="modelValue"
                :disabled="disabled"
                @input="$emit('update:modelValue', ($event.currentTarget as HTMLInputElement).checked)"
        >
    </label>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'BlockCheckbox',
        emits: ['update:modelValue'],
        props: {
            modelValue: {
                type: Boolean,
                required: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        }
    });
</script>

<style scoped>
    .disabled-label {
        cursor: not-allowed;
    }
</style>
