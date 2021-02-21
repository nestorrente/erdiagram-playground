<template>
    <Modal
            :title="globalModalDialogStore.title"
            :showing="globalModalDialogStore.showing"
            @update:showing="onModalShowingChange"
            max-width="420px"
            :append-header-class="globalModalDialogStore.headerClass"
            :append-title-class="globalModalDialogStore.titleClass"
    >
        <template #title>
            <Icon v-if="globalModalDialogStore.titleIcon" :icon="globalModalDialogStore.titleIcon"/>
            {{ globalModalDialogStore.title }}
        </template>
        <template #default>
            {{ globalModalDialogStore.message }}
        </template>
        <template #footer>
            <div class="buttons is-justify-content-flex-end">
                <Button
                        ref="acceptButtonRef"
                        v-if="globalModalDialogStore.acceptButton != null"
                        :color="globalModalDialogStore.acceptButton.color"
                        autofocus
                        @click="globalModalDialogStore.accept()"
                >
                    {{ globalModalDialogStore.acceptButton.text }}
                </Button>
                <Button
                        v-if="globalModalDialogStore.cancelButton != null"
                        :color="globalModalDialogStore.cancelButton.color"
                        @click="globalModalDialogStore.cancel()"
                >
                    {{ globalModalDialogStore.cancelButton.text }}
                </Button>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
    import {defineComponent, nextTick, ref, watch} from 'vue';
    import Modal from '@/components/generic/modal/Modal.vue';
    import globalModalDialogStore from '@/store/globalModalDialogStore';
    import Button from '@/components/generic/form/Button.vue';
    import Icon from '@/components/generic/form/Icon.vue';

    interface Focusable {
        focus(): void;
    }

    export default defineComponent({
        name: 'GlobalModalDialog',
        components: {
            Icon,
            Button,
            Modal
        },
        setup() {

            const acceptButtonRef = ref<Focusable>();

            function onModalShowingChange(showing: boolean) {
                if (!showing) {
                    globalModalDialogStore.cancel();
                }
            }

            watch(() => globalModalDialogStore.showing, showing => {
                if (showing) {
                    nextTick(() => {
                        const acceptButton = acceptButtonRef.value!;
                        setTimeout(() => {
                            acceptButton.focus();
                        }, 50);
                    });
                }
            });

            return {
                globalModalDialogStore,
                acceptButtonRef,
                onModalShowingChange
            };

        }
    });
</script>
