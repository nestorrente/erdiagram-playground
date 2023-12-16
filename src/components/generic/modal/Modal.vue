<template>
    <div :class="['modal', {
        'is-active': showing
    }]">
        <div
                class="modal-background"
                @click="onBackgroundClick"
        ></div>
        <div class="modal-card" v-bind="$attrs" :style="{maxWidth}">
            <header
                    class="modal-card-head"
                    :class="appendHeaderClass"
                    :style="appendHeaderStyle"
            >
                <p
                        class="modal-card-title"
                        :class="appendTitleClass"
                        :style="appendTitleStyle"
                >
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
            <section
                    class="modal-card-body"
                    :class="appendBodyClass"
                    :style="appendBodyStyle"
            >
                <slot></slot>
            </section>
            <footer
                    v-if="$slots.footer"
                    class="modal-card-foot"
                    :class="appendFooterClass"
                    :style="appendFooterStyle"
            >
                <div style="width: 100%">
                    <slot name="footer"></slot>
                </div>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent, getCurrentInstance, watch} from 'vue';
    import type {PropType, StyleValue} from 'vue';
    import openModalsStore from '@/store/openModalsStore';
    import {useDocumentEventListener} from '@/composition/event/useEventListener';

    interface Props {
        disableCloseOnBackgroundClick: boolean;
        disableCloseOnEscKey: boolean;
        title: string;
        showing: boolean;
        maxWidth: string;
        appendBodyClass: any;
        appendBodyStyle: any;
    }

    export default defineComponent({
        name: 'Modal',
        inheritAttrs: false,
        emits: ['update:showing'],
        props: {
            disableCloseOnBackgroundClick: {
                type: Boolean,
                default: false
            },
            disableCloseOnEscKey: {
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
            maxWidth: {
                type: String,
                required: false
            },
            appendHeaderClass: {
                type: [String, Array, Object],
                required: false
            },
            appendHeaderStyle: {
                type: [String, Array, Object] as PropType<StyleValue>,
                required: false
            },
            appendTitleClass: {
                type: [String, Array, Object],
                required: false
            },
            appendTitleStyle: {
                type: [String, Array, Object] as PropType<StyleValue>,
                required: false
            },
            appendBodyClass: {
                type: [String, Array, Object],
                required: false
            },
            appendBodyStyle: {
                type: [String, Array, Object] as PropType<StyleValue>,
                required: false
            },
            appendFooterClass: {
                type: [String, Array, Object],
                required: false
            },
            appendFooterStyle: {
                type: [String, Array, Object] as PropType<StyleValue>,
                required: false
            }
        },
        setup(uncastedProps, context) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            function onBackgroundClick() {
                const {disableCloseOnBackgroundClick} = props;

                if (!disableCloseOnBackgroundClick) {
                    close();
                }
            }

            const currentInstanceUID = getCurrentInstance()!.uid;

            watch(() => props.showing, showing => {
                if (showing) {
                    openModalsStore.registerModalOpen(currentInstanceUID);
                } else {
                    openModalsStore.registerModalClose(currentInstanceUID);
                }
            });

            const isFrontModal = computed(() => {
                return openModalsStore.frontModalUid === currentInstanceUID;
            });

            useDocumentEventListener('keydown', (event: KeyboardEvent) => {

                if (!isFrontModal.value) {
                    return;
                }

                if (!props.disableCloseOnEscKey && event.key === 'Escape') {
                    event.stopImmediatePropagation();
                    close();
                }

            });

            function close() {
                context.emit('update:showing', false);
            }

            return {
                onBackgroundClick
            };

        }
    });
</script>

<style lang="scss" scoped>
    .modal-card {
        $horizontal-margin: 2em;
        width: calc(100vw - #{$horizontal-margin} * 2);
    }
</style>
