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
                <Button
                        v-if="globalConfirmModalStore.acceptButton"
                        color="danger"
                        @click="globalConfirmModalStore.accept()"
                >
                    {{ globalConfirmModalStore.acceptButtonText }}
                </Button>
                <Button
                        v-if="globalConfirmModalStore.cancelButton"
                        @click="globalConfirmModalStore.cancel()"
                >
                    {{ globalConfirmModalStore.cancelButtonText }}
                </Button>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Modal from '@/components/modal/Modal.vue';
    import globalConfirmModalStore from '@/store/globalConfirmModalStore';
    import Button from '@/components/Button.vue';

    export default defineComponent({
        name: 'GlobalConfirmModal',
        components: {
            Button,
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
