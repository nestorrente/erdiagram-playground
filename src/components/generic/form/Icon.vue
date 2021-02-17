<template>
    <span class="icon" :class="color ? 'has-text-' + color : ''">
        <i :class="icon"></i>
    </span>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'Icon',
        props: {
            icon: String,
            color: String
        }
    });
</script>
