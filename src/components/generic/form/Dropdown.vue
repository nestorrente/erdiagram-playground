<template>
    <div
            ref="dropdown"
            class="dropdown"
            :class="{
                'is-hoverable': hoverable,
                'is-right': right,
                'is-up': up,
                'is-active': !hoverable && opened
            }"
    >
        <div
                class="dropdown-trigger"
                @click="toggleIfNotHoverable"
        >
            <slot name="trigger"></slot>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div
                    ref="dropdownContent"
                    class="dropdown-content"
            >
                <slot name="items"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import useClickOutside from '@/composition/useClickOutside';
    import useDelegatedClick from '@/composition/useDelegatedClick';

    export default defineComponent({
        name: 'Dropdown',
        props: {
            hoverable: Boolean,
            right: Boolean,
            up: Boolean
        },
        setup(props) {

            const dropdown = ref<HTMLElement>();
            const dropdownContent = ref<HTMLElement>();
            const opened = ref(false);

            function toggleIfNotHoverable() {
                if (!props.hoverable) {
                    opened.value = !opened.value;
                }
            }

            useDelegatedClick(dropdownContent, '.dropdown-item', closeIfNotHoverable);
            useClickOutside(dropdown, closeIfNotHoverable);

            function closeIfNotHoverable() {
                if (!props.hoverable) {
                    opened.value = false;
                }
            }

            return {
                dropdown,
                dropdownContent,
                opened,
                toggleIfNotHoverable
            };

        }
    });
</script>
