<template>
    <div class="toast-message-container is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
        <transition-group name="slide-down-max-height">
            <div
                    v-for="toastMessage in globalToastMessageStore.toastMessages"
                    :key="toastMessage.uuid"
                    class="toast-message"
                    :style="{
                        '--toast-message-max-width': `${toastMessage.maxWidth}px`
                    }"
            >
                <div
                        class="notification p-4"
                        :class="getToastColorClass(toastMessage.type)"
                >
                    <Icon :icon="'fas fa-' + getToastMessageIcon(toastMessage.type)"/>
                    {{ toastMessage.message }}
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import globalToastMessageStore, {ToastMessageType} from '@/store/globalToastMessageStore';
    import Icon from '@/components/generic/form/Icon.vue';

    export default defineComponent({
        name: 'GlobalToastMessage',
        components: {Icon},
        setup() {

            function getToastColorClass(toastMessageType: ToastMessageType) {
                switch (toastMessageType) {
                    case ToastMessageType.SUCCESS:
                        return 'is-success';
                    case ToastMessageType.INFO:
                        return 'is-info';
                    case ToastMessageType.WARNING:
                        return 'is-warning';
                    case ToastMessageType.ERROR:
                        return 'is-danger';
                    default:
                        throw new Error('Unknown toast message type: ' + toastMessageType);
                }
            }

            function getToastMessageIcon(toastMessageType: ToastMessageType) {
                switch (toastMessageType) {
                    case ToastMessageType.SUCCESS:
                        return 'check';
                    case ToastMessageType.INFO:
                        return 'info-circle';
                    case ToastMessageType.WARNING:
                        return 'exclamation-triangle';
                    case ToastMessageType.ERROR:
                        return 'exclamation-circle';
                    default:
                        throw new Error('Unknown toast message type: ' + toastMessageType);
                }
            }

            return {
                globalToastMessageStore,
                getToastColorClass,
                getToastMessageIcon
            };

        }
    });
</script>

<style lang="scss">
    .toast-message-container {

        position: fixed;
        top: 1.5rem;
        left: 0;
        right: 0;
        z-index: 1000;
        pointer-events: none;

        > .toast-message {

            --toast-message-max-height: 200px;
            --toast-message-max-width: 400px;

            display: flex;
            align-items: flex-end;

            max-width: min(50%, var(--toast-message-max-width));
            max-height: var(--toast-message-max-height);

            > .notification {
                max-height: var(--toast-message-max-height);
                margin-top: 1.5rem;
                pointer-events: all;
            }

        }

    }
</style>
