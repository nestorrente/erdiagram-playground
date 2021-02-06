<template>
    <Modal
            title="Confirm"
            :showing="globalConfirmModalStore.showing"
            @update:showing="onModalShowingChange"
            max-width="420px"
    >
        <template #default>
            {{ globalConfirmModalStore.title }}
        </template>
        <template #footer>
            <div class="buttons is-justify-content-flex-end">
                <button
                        v-if="globalConfirmModalStore.acceptButton"
                        class="button is-danger"
                        @click="globalConfirmModalStore.accept()"
                >
                    {{ globalConfirmModalStore.acceptButtonText }}
                </button>
                <button
                        class="button"
                        @click="globalConfirmModalStore.cancel()"
                >
                    {{ globalConfirmModalStore.cancelButtonText }}
                </button>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Modal from '@/components/Modal.vue';
    import globalConfirmModalStore from '@/store/globalConfirmModalStore';

    export default defineComponent({
        name: 'GlobalConfirmModal',
        components: {
            Modal
        },
        setup() {

            function onModalShowingChange(showing: boolean) {
                if (!showing) {
                    globalConfirmModalStore.cancel();
                }
            }

            return {
                globalConfirmModalStore,
                onModalShowingChange
            };

        }
    });
</script>
