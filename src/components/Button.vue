<template>
    <button
            v-bind="$attrs"
            class="button"
            :class="[
                color ? `is-${color}` : '',
                {
                    'is-text': text,
                    'is-ghost': ghost,
                    'is-light': light,
                    'is-small': small,
                    'is-normal': normal,
                    'is-medium': medium,
                    'is-large': large,
                    'is-fullwidth': fullwidth,
                    'is-outlined': outlined,
                    'is-inverted': inverted,
                    'is-rounded': rounded,
                    'is-hovered': hovered,
                    'is-focused': focused,
                    'is-active': active,
                    'is-loading': loading,
                    'is-static': static,
                }
            ]"
            :disabled="disabled"
    >
        <span v-if="icon" class="icon">
            <i :class="icon"></i>
        </span>
        <span class="button-text">
            <slot></slot>
        </span>
    </button>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'Button',
        props: {
            color: String,
            text: Boolean,
            ghost: Boolean,
            light: Boolean,
            small: Boolean,
            normal: Boolean,
            medium: Boolean,
            large: Boolean,
            fullwidth: Boolean,
            outlined: Boolean,
            inverted: Boolean,
            rounded: Boolean,
            hovered: Boolean,
            focused: Boolean,
            active: Boolean,
            loading: Boolean,
            static: Boolean,
            disabled: Boolean,
            icon: String,
        }
    });
</script>
