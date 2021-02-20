<template>
    <div class="columns is-mobile">
        <div class="column is-narrow">
            <Dropdown up>
                <template #trigger>
                    <Button
                            icon="fas fa-angle-up"
                            class="is-button-text-hidden-mobile"
                    >
                        More actions
                    </Button>
                </template>
                <template #items>
                    <FileReadWrapper
                            accept=".json"
                            :listen-keyboard-open-shortcut="listenKeyboardShortcuts"
                            @success="$emit('importConfigSuccess', $event)"
                            @error="$emit('importConfigError', $event)"
                            #default="{openFile}"
                    >
                        <DropdownItem
                                @click="openFile"
                                :title="listenKeyboardShortcuts ? 'Ctrl + O' : ''"
                        >
                            <Icon icon="fas fa-file-import"/>
                            Import config
                        </DropdownItem>
                    </FileReadWrapper>
                    <FileDownloadWrapper
                            file-name="erdiagram_config.json"
                            :file-contents="configFileContentsSupplier"
                            :listen-keyboard-save-shortcut="listenKeyboardShortcuts"
                            #default="{downloadFile}"
                    >
                        <DropdownItem
                                @click="downloadFile"
                                :title="listenKeyboardShortcuts ? 'Ctrl + S' : ''"
                        >
                            <Icon icon="fas fa-file-export"/>
                            Export config
                        </DropdownItem>
                    </FileDownloadWrapper>
                    <DropdownDivider/>
                    <DropdownItem
                            @click="restoreDefaultConfig"
                            :title="listenKeyboardShortcuts ? 'Ctrl + Backspace' : ''"
                    >
                        <Icon icon="fas fa-undo-alt"/>
                        Restore default values
                    </DropdownItem>
                </template>
            </Dropdown>
        </div>
        <div class="column has-text-right">
            <Button
                    color="success"
                    icon="fas fa-save"
                    @click="$emit('saveChanges')"
            >
                Save
            </Button>
            <Button
                    icon="fas fa-times"
                    @click="$emit('cancel')"
            >
                Cancel
            </Button>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {showConfirmModal} from '@/store/globalModalDialogStore';
    import Button from '@/components/generic/form/Button.vue';
    import Dropdown from '@/components/generic/form/Dropdown.vue';
    import DropdownItem from '@/components/generic/form/DropdownItem.vue';
    import DropdownDivider from '@/components/generic/form/DropdownDivider.vue';
    import Icon from '@/components/generic/form/Icon.vue';
    import FileReadWrapper from '@/components/generic/file/FileReadWrapper.vue';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';
    import useDocumentEventListener from '@/composition/useDocumentEventListener';

    export default defineComponent({
        name: 'SettingsModalFooter',
        emits: [
            'importConfigSuccess',
            'importConfigError',
            'exportConfig',
            'restoreDefaultConfig',
            'saveChanges',
            'cancel'
        ],
        components: {
            FileDownloadWrapper,
            FileReadWrapper,
            Icon,
            DropdownDivider,
            DropdownItem,
            Dropdown,
            Button,
        },
        props: {
            listenKeyboardShortcuts: {
                type: Boolean,
                default: false
            },
            configFileContentsSupplier: {
                type: Function,
                required: true
            }
        },
        setup(props, context) {

            async function restoreDefaultConfig() {
                if (await confirmRestoreDefaultConfig()) {
                    context.emit('restoreDefaultConfig');
                }
            }

            function confirmRestoreDefaultConfig() {
                return showConfirmModal({
                    message: 'Do you really want restore the default values?',
                    acceptButtonText: 'Yes, go ahead',
                    cancelButtonText: 'No, take me back'
                });
            }

            useDocumentEventListener('keydown', (event: KeyboardEvent) => {
                if (props.listenKeyboardShortcuts && event.ctrlKey && event.key === 'Backspace') {
                    restoreDefaultConfig();
                }
            });

            return {
                restoreDefaultConfig
            };

        }
    });
</script>
