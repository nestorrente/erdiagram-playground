<template>
    <div class="columns">
        <div class="column is-half">
            <Dropdown up hoverable>
                <template #trigger>
                    <Button icon="fas fa-bars">
                        More actions
                    </Button>
                </template>
                <template #items>
                    <DropdownItem @click="onImportConfigButtonClick">
                        <Icon icon="fas fa-file-import"/>
                        Import config
                        <input
                                ref="fileInput"
                                type="file"
                                class="is-hidden"
                                accept=".json"
                                @change="onFileChange"
                        >
                    </DropdownItem>
                    <DropdownItem @click="$emit('exportConfig')">
                        <Icon icon="fas fa-file-export"/>
                        Export config
                    </DropdownItem>
                    <DropdownDivider/>
                    <DropdownItem @click="restoreDefaultConfig">
                        <Icon icon="fas fa-undo-alt"/>
                        Restore default values
                    </DropdownItem>
                </template>
            </Dropdown>
        </div>
        <div class="column is-half has-text-right">
            <Button color="success" icon="fas fa-save" @click="$emit('saveChanges')">
                Save changes
            </Button>
            <Button @click="$emit('cancel')">
                Cancel
            </Button>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import {showConfirmModal} from '@/store/globalConfirmModalStore';
    import Button from '@/components/generic/form/Button.vue';
    import Dropdown from '@/components/generic/form/Dropdown.vue';
    import DropdownItem from '@/components/generic/form/DropdownItem.vue';
    import DropdownDivider from '@/components/generic/form/DropdownDivider.vue';
    import Icon from '@/components/generic/form/Icon.vue';

    export default defineComponent({
        name: 'ConfigModalFooter',
        emits: [
            'importConfig',
            'exportConfig',
            'restoreDefaultConfig',
            'saveChanges',
            'cancel'
        ],
        components: {
            Icon,
            DropdownDivider,
            DropdownItem,
            Dropdown,
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

            const fileInput = ref<HTMLInputElement>();

            function onImportConfigButtonClick(event: MouseEvent) {
                if (event.target !== fileInput.value) {
                    fileInput.value!.click();
                }
            }

            function onFileChange() {

                const fileInputElement = fileInput.value!;

                const files = fileInputElement.files;

                if (files?.length !== 1) {
                    return;
                }

                context.emit('importConfig', readFile(files[0]));

                // Reset input
                fileInputElement.value = '';

            }

            function readFile(file: File): Promise<string> {
                return new Promise((resolve, reject) => {

                    const fileReader = new FileReader();

                    fileReader.addEventListener('load', () => {
                        resolve(fileReader.result as string);
                    });

                    fileReader.addEventListener('error', () => {
                        reject(fileReader.error);
                    });

                    fileReader.readAsText(file);

                });
            }

            return {
                restoreDefaultConfig,
                fileInput,
                onImportConfigButtonClick,
                onFileChange
            };

        }
    });
</script>
