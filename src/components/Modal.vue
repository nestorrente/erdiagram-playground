<template>
    <div :class="['modal', {
        'is-active': showing
    }]">
        <div
                class="modal-background"
                @click="onBackgroundClick"
        ></div>
        <div class="modal-card" :style="{ width }">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    <slot
                            v-if="$slots.title"
                            name="title"
                    ></slot>
                    <template v-else>
                        {{ title }}
                    </template>
                </p>
                <button
                        class="delete"
                        aria-label="close"
                        @click="$emit('update:showing', false)"
                ></button>
            </header>
            <section class="modal-card-body" :class="appendBodyClass" :style="appendBodyStyle">
                <slot></slot>
            </section>
            <footer v-if="$slots.footer" class="modal-card-foot">
                <div style="width: 100%">
                    <slot name="footer"></slot>
                </div>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    interface Props {
        closeOnBackgroundClick: boolean;
    }

    export default defineComponent({
        name: 'Modal',
        inheritAttrs: false,
        emits: ['update:showing'],
        props: {
            closeOnBackgroundClick: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                required: false
            },
            showing: {
                type: Boolean,
                default: false
            },
            width: {
                type: [Number, String],
                required: false
            },
            appendBodyClass: {
                type: [String, Array, Object],
                required: false
            },
            appendBodyStyle: {
                type: [String, Array, Object],
                required: false
            }
        },
        setup(props, context) {

            function onBackgroundClick() {
                const {closeOnBackgroundClick} = props as Props;

                if (closeOnBackgroundClick) {
                    context.emit('update:showing', false);
                }
            }

            return {
                onBackgroundClick
            };

        }
    });
</script>
