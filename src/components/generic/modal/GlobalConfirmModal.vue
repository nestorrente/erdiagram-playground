<template>
    <Modal
            :title="globalConfirmModalStore.title"
            :showing="globalConfirmModalStore.showing"
            @update:showing="onModalShowingChange"
            max-width="420px"
    >
        <template #default>
            {{ globalConfirmModalStore.message }}
        </template>
        <template #footer>
            <div class="buttons is-justify-content-flex-end">
                <Button
                        v-if="globalConfirmModalStore.acceptButton"
                        :color="globalConfirmModalStore.acceptButtonColor"
                        @click="globalConfirmModalStore.accept()"
                >
                    {{ globalConfirmModalStore.acceptButtonText }}
                </Button>
                <Button
                        v-if="globalConfirmModalStore.cancelButton"
                        :color="globalConfirmModalStore.cancelButtonColor"
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
    import Modal from '@/components/generic/modal/Modal.vue';
    import globalConfirmModalStore from '@/store/globalConfirmModalStore';
    import Button from '@/components/generic/form/Button.vue';

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
