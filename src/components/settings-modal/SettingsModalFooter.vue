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
                                :title="'Upload a settings JSON file' + (listenKeyboardShortcuts ? ' (Ctrl + O)' : '')"
                        >
                            <Icon icon="fas fa-file-import"/>
                            Import settings
                        </DropdownItem>
                    </FileReadWrapper>
                    <FileDownloadWrapper
                            file-name="erdiagram_settings.json"
                            :file-contents="configFileContentsSupplier"
                            :listen-keyboard-save-shortcut="listenKeyboardShortcuts"
                            #default="{downloadFile}"
                    >
                        <DropdownItem
                                @click="downloadFile"
                                :title="'Download the settings as a JSON file' + (listenKeyboardShortcuts ? ' (Ctrl + S)' : '')"
                        >
                            <Icon icon="fas fa-file-export"/>
                            Export settings
                        </DropdownItem>
                    </FileDownloadWrapper>
                    <DropdownDivider/>
                    <DropdownItem
                            @click="restoreDefaultConfig"
                            title="Restores the default value of all settings"
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
    import {showConfirmModalDialog} from '@/store/globalModalDialogStore';
    import Button from '@/components/generic/form/Button.vue';
    import Dropdown from '@/components/generic/form/Dropdown.vue';
    import DropdownItem from '@/components/generic/form/DropdownItem.vue';
    import DropdownDivider from '@/components/generic/form/DropdownDivider.vue';
    import Icon from '@/components/generic/form/Icon.vue';
    import FileReadWrapper from '@/components/generic/file/FileReadWrapper.vue';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';

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
        setup(_props, context) {

            async function restoreDefaultConfig() {
                if (await confirmRestoreDefaultConfig()) {
                    context.emit('restoreDefaultConfig');
                }
            }

            function confirmRestoreDefaultConfig() {
                return showConfirmModalDialog({
                    message: 'Do you really want restore the default values?',
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
