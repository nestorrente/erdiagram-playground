<template>
    <span class="icon">
        <i :class="icon"></i>
    </span>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'Icon',
        props: {
            icon: String
        }
    });
</script>
