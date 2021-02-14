<template>
    <div class="has-text-right">
        <Button color="success" @click="$emit('saveChanges')">
            Save changes
        </Button>
        <Button @click="restoreDefaultConfig">
            Restore default values
        </Button>
        <Button @click="$emit('cancel')">
            Cancel
        </Button>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {showConfirmModal} from '@/store/globalConfirmModalStore';
    import Button from '@/components/generic/form/Button.vue';

    export default defineComponent({
        name: 'ConfigModalFooter',
        emits: [
            'saveChanges',
            'restoreDefaultConfig',
            'cancel'
        ],
        components: {
            Button,
        },
        setup(props, context) {

            async function restoreDefaultConfig() {
                if (await confirmRestoreDefaultConfig()) {
                    context.emit('restoreDefaultConfig');
                }
            }

            function confirmRestoreDefaultConfig() {
                return showConfirmModal({
                    title: 'Do you really want restore the default values?',
                    acceptButtonText: 'Yes, go ahead',
                    cancelButtonText: 'No, take me back'
                });
            }

            return {
                restoreDefaultConfig
            };

        }
    });
</script>
