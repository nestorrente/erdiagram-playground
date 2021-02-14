<template>
    <div class="dropdown" :class="{
        'is-hoverable': hoverable,
        'is-right': right,
        'is-up': up
    }">
        <div class="dropdown-trigger">
            <slot name="trigger"></slot>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <slot name="items"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'Dropdown',
        props: {
            hoverable: Boolean,
            right: Boolean,
            up: Boolean
        }
    });
</script>
