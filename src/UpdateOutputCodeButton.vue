<template>
    <button
            class="button is-fullwidth background-transition"
            :class="{
                'is-warning': modelOutdated,
                'is-danger is-light': !modelOutdated && hasErrors,
                'is-success is-light': !modelOutdated && !hasErrors
            }"
            @click="$emit('click')"
    >
        <span v-show="modelOutdated">
            <span class="icon">
                <i class="fas fa-sync"></i>
            </span>
            <span>
                Update output code
                (<span class="is-family-code">Ctrl + &#9166;</span>)
            </span>
        </span>
        <span v-show="!modelOutdated && hasErrors">
            <span class="icon">
                <i class="fas fa-times"></i>
            </span>
            <span>
                There's an error in your code
            </span>
        </span>
        <span v-show="!modelOutdated && !hasErrors">
            <span class="icon">
                <i class="fas fa-check"></i>
            </span>
            <span>
                Output code is up-to-date :)
            </span>
        </span>
    </button>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'UpdateOutputCodeButton',
        emit: ['click'],
        props: {
            modelOutdated: Boolean,
            hasErrors: Boolean
        }
    });
</script>
