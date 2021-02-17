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
    import {defineComponent} from 'vue';

    interface Props {
        disableCloseOnBackgroundClick: boolean;
        // disableCloseOnEscPress: boolean;
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
            // disableCloseOnEscPress: {
            //     type: Boolean,
            //     default: false
            // },
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
                type: [String, Array, Object],
                required: false
            },
            appendTitleClass: {
                type: [String, Array, Object],
                required: false
            },
            appendTitleStyle: {
                type: [String, Array, Object],
                required: false
            },
            appendBodyClass: {
                type: [String, Array, Object],
                required: false
            },
            appendBodyStyle: {
                type: [String, Array, Object],
                required: false
            },
            appendFooterClass: {
                type: [String, Array, Object],
                required: false
            },
            appendFooterStyle: {
                type: [String, Array, Object],
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

            // FIXME there is one problem in doing this:
            //  as we can have multiple modals open at the same time (i.e., the settings and the confirm modals),
            //  it's not possible to know which modal has to be closed.
            //
            // onMounted(() => document.addEventListener('keydown', onDocumentKeydown));
            // onBeforeUnmount(() => document.removeEventListener('keydown', onDocumentKeydown));
            //
            // function onDocumentKeydown(event: KeyboardEvent) {
            //     if (!props.disableCloseOnEscPress && event.key === 'Escape') {
            //         close();
            //     }
            // }

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
