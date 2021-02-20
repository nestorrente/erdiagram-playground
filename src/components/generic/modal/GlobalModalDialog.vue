<template>
    <Modal
            :title="globalModalDialogStore.title"
            :showing="globalModalDialogStore.showing"
            @update:showing="onModalShowingChange"
            max-width="420px"
            :append-header-class="globalModalDialogStore.headerClass"
            :append-title-class="globalModalDialogStore.titleClass"
            @global-keydown="onGlobalKeydown"
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
                        v-if="globalModalDialogStore.acceptButton != null"
                        :color="globalModalDialogStore.acceptButton.color"
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
    import {defineComponent} from 'vue';
    import Modal from '@/components/generic/modal/Modal.vue';
    import globalModalDialogStore from '@/store/globalModalDialogStore';
    import Button from '@/components/generic/form/Button.vue';
    import Icon from '@/components/generic/form/Icon.vue';

    export default defineComponent({
        name: 'GlobalModalDialog',
        components: {
            Icon,
            Button,
            Modal
        },
        setup() {

            function onModalShowingChange(showing: boolean) {
                if (!showing) {
                    globalModalDialogStore.cancel();
                }
            }

            function onGlobalKeydown(event: KeyboardEvent) {
                if (event.key === 'Enter') {
                    event.stopImmediatePropagation();
                    globalModalDialogStore.accept();
                }
            }

            return {
                globalModalDialogStore,
                onModalShowingChange,
                onGlobalKeydown
            };

        }
    });
</script>
