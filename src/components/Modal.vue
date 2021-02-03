<template>
    <div :class="['modal', {
        'is-active': showing
    }]">
        <div
                class="modal-background"
                @click="$emit('update:showing', false)"
        ></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{ title }}</p>
                <button
                        class="delete"
                        aria-label="close"
                        @click="$emit('update:showing', false)"
                ></button>
            </header>
            <section class="modal-card-body">
                <slot></slot>
            </section>
            <footer v-if="$slots.footer" class="modal-card-foot">
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'Modal',
        emits: ['update:showing'],
        props: {
            title: {
                type: String,
                required: true
            },
            showing: {
                type: Boolean,
                default: false
            }
        }
    };
</script>
