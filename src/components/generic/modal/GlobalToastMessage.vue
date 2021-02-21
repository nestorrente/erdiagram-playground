<template>
    <div class="toast-container is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
        <transition name="slide-down">
            <div
                    v-if="toastMessage != null"
                    class="notification p-4"
                    :class="getToastColorClass(toastMessage.type)"
            >
                <Icon :icon="'fas fa-' + getToastMessageIcon(toastMessage.type)"/>
                {{ toastMessage.message }}
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent} from 'vue';
    import globalToastMessageStore, {ToastMessage, ToastMessageType} from '@/store/globalToastMessageStore';
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

            const lastToastMessage = computed((): ToastMessage | null => {

                const {toastMessages} = globalToastMessageStore;

                if (toastMessages.length === 0) {
                    return null;
                }

                return toastMessages[toastMessages.length - 1];

            });

            return {
                globalToastMessageStore,
                toastMessage: lastToastMessage,
                getToastColorClass,
                getToastMessageIcon
            };

        }
    });
</script>

<style lang="scss">
    .toast-container {

        position: fixed;
        top: 3rem;
        left: 0;
        right: 0;
        z-index: 1000;

        > .notification {
            max-width: min(50%, 400px);
            position: relative;
            transition-property: opacity, transform, height;
        }

    }
</style>
