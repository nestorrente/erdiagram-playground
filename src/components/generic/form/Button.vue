<template>
    <button
            ref="button"
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
            v-bind="$attrs"
    >
        <Icon
                v-if="icon"
                :icon="icon"
                :color="iconColor"
        />
        <span v-if="$slots.default" class="button-text">
            <slot></slot>
        </span>
    </button>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Icon from '@/components/generic/form/Icon.vue';

    export default defineComponent({
        inheritAttrs: false,
        name: 'Button',
        components: {Icon},
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
            icon: String,
            iconColor: String
        },
        methods: {
            click() {
                (this.$refs.button as HTMLButtonElement).click();
            },
            focus() {
                (this.$refs.button as HTMLButtonElement).focus();
            }
        }
    });
</script>
